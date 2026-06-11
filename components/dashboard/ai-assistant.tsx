'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Bot, Send, Sparkles, User } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ScanResult } from '@/lib/scanner-data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Why is this contract vulnerable?',
  'How do I fix the reentrancy issue?',
  'Explain the access control problem',
  'What is the most urgent fix?',
];

function generateAnswer(question: string, scan: ScanResult): string {
  const q = question.toLowerCase();
  if (q.includes('reentrancy')) {
    return `The reentrancy issue lives in withdraw(). It sends Ether with msg.sender.call{value: amount}("") before decrementing balances[msg.sender]. An attacker's fallback can re-enter withdraw() while their balance still shows the full amount.\n\nFix: follow checks-effects-interactions — update the balance first, then transfer — or wrap the function with OpenZeppelin's nonReentrant modifier.`;
  }
  if (q.includes('access') || q.includes('owner')) {
    return `setOwner() has no authorization check, so any address can claim ownership. That cascades into control over every owner-gated function.\n\nFix: add an onlyOwner modifier (or inherit OpenZeppelin Ownable) and emit OwnershipTransferred for traceability.`;
  }
  if (q.includes('urgent') || q.includes('first') || q.includes('priority')) {
    return `Prioritize the two Critical findings: the Reentrancy in withdraw() and the Unprotected selfdestruct in kill(). Both allow total loss of funds and can be triggered by any external caller. Patch those before anything else, then address the High-severity access control issue.`;
  }
  if (q.includes('vulnerable') || q.includes('why')) {
    return `This contract scores ${scan.securityScore}/100 (${scan.riskLevel}). It contains ${scan.criticalIssues} critical issues. The biggest problems: state is mutated after external calls (reentrancy), ownership and selfdestruct lack access control, and randomness is derived from manipulable block values. Together these create direct fund-loss and takeover paths.`;
  }
  return `Based on this scan of ${scan.contractName}, the contract has ${scan.totalVulnerabilities} findings including ${scan.criticalIssues} critical. Ask me about a specific vulnerability — reentrancy, access control, selfdestruct, or randomness — and I'll explain the risk and the exact fix.`;
}

export function AiAssistant({ scan }: { scan: ScanResult }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I reviewed ${scan.contractName}. It scored ${scan.securityScore}/100 with ${scan.criticalIssues} critical issues. Ask me anything about the findings or how to fix them.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    const content = text.trim();
    if (!content) return;
    setMessages(m => [...m, { role: 'user', content }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { role: 'assistant', content: generateAnswer(content, scan) },
      ]);
      setTyping(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      });
    }, 700);
  }

  return (
    <div className='flex h-[520px] flex-col'>
      <div className='flex items-center gap-2 border-b border-border px-4 py-3'>
        <div className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          <HugeiconsIcon icon={Sparkles} className='size-4' />
        </div>
        <div>
          <p className='text-sm font-semibold'>AI Audit Assistant</p>
          <p className='text-xs text-muted-foreground'>
            Ask about vulnerabilities and fixes
          </p>
        </div>
      </div>

      <div ref={scrollRef} className='flex-1 space-y-4 overflow-y-auto p-4'>
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2.5',
              m.role === 'user' && 'flex-row-reverse',
            )}
          >
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-lg',
                m.role === 'assistant'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {m.role === 'assistant' ? (
                <HugeiconsIcon icon={Bot} className='size-4' />
              ) : (
                <HugeiconsIcon icon={User} className='size-4' />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                m.role === 'assistant'
                  ? 'rounded-tl-sm bg-muted'
                  : 'rounded-tr-sm bg-primary text-primary-foreground',
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className='flex gap-2.5'>
            <div className='flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <HugeiconsIcon icon={Bot} className='size-4' />
            </div>
            <div className='flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3'>
              <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]' />
              <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]' />
              <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground' />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className='flex flex-wrap gap-2 px-4 pb-3'>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className='rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground'
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          send(input);
        }}
        className='flex items-center gap-2 border-t border-border p-3'
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Ask about this contract...'
          className='flex-1'
        />
        <Button type='submit' size='icon' disabled={!input.trim()}>
          <HugeiconsIcon icon={Send} className='size-4' />
          <span className='sr-only'>Send</span>
        </Button>
      </form>
    </div>
  );
}
