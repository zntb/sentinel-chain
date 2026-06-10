export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type RiskLevel =
  | 'Safe'
  | 'Low Risk'
  | 'Medium Risk'
  | 'High Risk'
  | 'Critical';
export type Network =
  | 'Ethereum'
  | 'Polygon'
  | 'BNB Chain'
  | 'Arbitrum'
  | 'Base';

export interface Reference {
  label: string;
  url: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  description: string;
  affectedCode: string;
  affectedLines: string;
  riskExplanation: string;
  recommendation: string;
  references: Reference[];
}

export interface ScoreBreakdown {
  label: string;
  score: number;
}

export interface ScanResult {
  id: string;
  contractName: string;
  address: string;
  network: Network;
  scannedAt: string;
  securityScore: number;
  riskLevel: RiskLevel;
  totalVulnerabilities: number;
  criticalIssues: number;
  gasIssues: number;
  qualityIssues: number;
  complexity: number;
  verified: boolean;
  vulnerabilities: Vulnerability[];
  breakdown: ScoreBreakdown[];
  trend: { label: string; score: number }[];
}

export const NETWORKS: Network[] = [
  'Ethereum',
  'Polygon',
  'BNB Chain',
  'Arbitrum',
  'Base',
];

export const SEVERITY_META: Record<
  Severity,
  { label: string; token: string; bg: string; text: string; border: string }
> = {
  critical: {
    label: 'Critical',
    token: 'critical',
    bg: 'bg-critical/15',
    text: 'text-critical',
    border: 'border-critical/30',
  },
  high: {
    label: 'High',
    token: 'high',
    bg: 'bg-high/15',
    text: 'text-high',
    border: 'border-high/30',
  },
  medium: {
    label: 'Medium',
    token: 'medium',
    bg: 'bg-medium/15',
    text: 'text-medium',
    border: 'border-medium/30',
  },
  low: {
    label: 'Low',
    token: 'low',
    bg: 'bg-low/15',
    text: 'text-low',
    border: 'border-low/30',
  },
  info: {
    label: 'Info',
    token: 'muted',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
};

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'Critical':
      return 'text-critical';
    case 'High Risk':
      return 'text-high';
    case 'Medium Risk':
      return 'text-medium';
    case 'Low Risk':
      return 'text-low';
    case 'Safe':
      return 'text-safe';
  }
}

export function scoreToRisk(score: number): RiskLevel {
  if (score >= 90) return 'Safe';
  if (score >= 75) return 'Low Risk';
  if (score >= 55) return 'Medium Risk';
  if (score >= 35) return 'High Risk';
  return 'Critical';
}

export const DEMO_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract VulnerableVault {
    mapping(address => uint256) public balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Reentrancy: state updated after external call
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;
    }

    // Missing access control
    function setOwner(address newOwner) public {
        owner = newOwner;
    }

    // Weak randomness
    function random() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
    }

    // Unprotected selfdestruct
    function kill() public {
        selfdestruct(payable(msg.sender));
    }
}`;

const SAMPLE_VULNS: Vulnerability[] = [
  {
    id: 'v1',
    title: 'Reentrancy Attack',
    severity: 'critical',
    category: 'Reentrancy',
    description:
      'The withdraw() function transfers Ether to the caller before updating the internal balance, allowing a malicious contract to recursively call back into withdraw() and drain funds.',
    affectedCode: `function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // state updated too late
}`,
    affectedLines: 'L16-L21',
    riskExplanation:
      'An attacker deploys a contract whose fallback function re-enters withdraw(). Because the balance is only decremented after the external call, the require check keeps passing and the attacker can withdraw repeatedly until the vault is empty.',
    recommendation:
      'Apply the checks-effects-interactions pattern: update balances before the external call, or use OpenZeppelin\u2019s ReentrancyGuard (nonReentrant modifier).',
    references: [
      {
        label: 'SWC-107: Reentrancy',
        url: 'https://swcregistry.io/docs/SWC-107',
      },
      {
        label: 'OpenZeppelin ReentrancyGuard',
        url: 'https://docs.openzeppelin.com/contracts/api/security#ReentrancyGuard',
      },
    ],
  },
  {
    id: 'v2',
    title: 'Missing Access Control',
    severity: 'high',
    category: 'Access Control',
    description:
      'setOwner() can be called by any external account, allowing anyone to take over ownership of the contract.',
    affectedCode: `function setOwner(address newOwner) public {
    owner = newOwner; // no authorization check
}`,
    affectedLines: 'L24-L26',
    riskExplanation:
      'Any user can call setOwner() and assign themselves as the owner, gaining control of all owner-restricted functionality and potentially locking out the legitimate owner.',
    recommendation:
      'Restrict the function with an onlyOwner modifier or OpenZeppelin\u2019s Ownable access control and emit an OwnershipTransferred event.',
    references: [
      {
        label: 'SWC-105: Unprotected Access',
        url: 'https://swcregistry.io/docs/SWC-105',
      },
    ],
  },
  {
    id: 'v3',
    title: 'Unprotected Selfdestruct',
    severity: 'critical',
    category: 'Self-destruct',
    description:
      'The kill() function calls selfdestruct without any access control, allowing anyone to permanently destroy the contract.',
    affectedCode: `function kill() public {
    selfdestruct(payable(msg.sender));
}`,
    affectedLines: 'L34-L36',
    riskExplanation:
      'Any account can invoke kill(), destroying the contract bytecode and forwarding its entire balance to the caller. This is an immediate total-loss vector.',
    recommendation:
      'Add strict access control to any selfdestruct call, or remove the function entirely if contract destruction is not required.',
    references: [
      {
        label: 'SWC-106: Unprotected SELFDESTRUCT',
        url: 'https://swcregistry.io/docs/SWC-106',
      },
    ],
  },
  {
    id: 'v4',
    title: 'Weak Source of Randomness',
    severity: 'medium',
    category: 'Randomness',
    description:
      'Randomness is derived from block.timestamp and block.difficulty, which are predictable and can be influenced by miners/validators.',
    affectedCode: `function random() public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
}`,
    affectedLines: 'L29-L31',
    riskExplanation:
      'Validators can manipulate block values, and any observer can compute the same value, making outcomes that depend on this randomness exploitable.',
    recommendation:
      'Use a verifiable randomness source such as Chainlink VRF instead of on-chain block values.',
    references: [
      {
        label: 'SWC-120: Weak Randomness',
        url: 'https://swcregistry.io/docs/SWC-120',
      },
    ],
  },
  {
    id: 'v5',
    title: 'Outdated Compiler Version',
    severity: 'low',
    category: 'Best Practices',
    description:
      'The contract pins an old Solidity version (^0.7.0) that lacks built-in overflow checks and recent safety features.',
    affectedCode: `pragma solidity ^0.7.0;`,
    affectedLines: 'L2',
    riskExplanation:
      'Solidity <0.8.0 does not include automatic arithmetic overflow/underflow protection, increasing the surface for integer bugs.',
    recommendation:
      'Upgrade to a recent, fixed compiler version (e.g. pragma solidity 0.8.24) and review arithmetic operations.',
    references: [
      {
        label: 'SWC-103: Floating Pragma',
        url: 'https://swcregistry.io/docs/SWC-103',
      },
    ],
  },
  {
    id: 'v6',
    title: 'Missing Event Emission',
    severity: 'low',
    category: 'Code Quality',
    description:
      'State-changing functions such as deposit() and setOwner() do not emit events, making off-chain tracking and auditing difficult.',
    affectedCode: `function deposit() public payable {
    balances[msg.sender] += msg.value; // no event
}`,
    affectedLines: 'L12-L14',
    riskExplanation:
      'Without events, indexers and monitoring tools cannot reliably observe critical state transitions, hindering incident response.',
    recommendation:
      'Emit descriptive events (e.g. Deposit, OwnershipTransferred) for all state-changing operations.',
    references: [],
  },
];

export const DEMO_SCAN: ScanResult = {
  id: 'scan-demo',
  contractName: 'VulnerableVault',
  address: '0x7a3b9c2f1e8d4a6b5c0f9e2d1a8b7c6d5e4f3a2b',
  network: 'Ethereum',
  scannedAt: '2026-06-10T10:24:00Z',
  securityScore: 38,
  riskLevel: 'High Risk',
  totalVulnerabilities: 6,
  criticalIssues: 2,
  gasIssues: 3,
  qualityIssues: 2,
  complexity: 64,
  verified: false,
  vulnerabilities: SAMPLE_VULNS,
  breakdown: [
    { label: 'Access Control', score: 40 },
    { label: 'Reentrancy', score: 20 },
    { label: 'Arithmetic', score: 70 },
    { label: 'Randomness', score: 55 },
    { label: 'Best Practices', score: 60 },
    { label: 'Gas', score: 65 },
  ],
  trend: [
    { label: 'v1', score: 22 },
    { label: 'v2', score: 30 },
    { label: 'v3', score: 34 },
    { label: 'v4', score: 38 },
  ],
};

export interface HistoryEntry {
  id: string;
  contractName: string;
  address: string;
  network: Network;
  scannedAt: string;
  securityScore: number;
  riskLevel: RiskLevel;
}

export const SCAN_HISTORY: HistoryEntry[] = [
  {
    id: 'scan-demo',
    contractName: 'VulnerableVault',
    address: '0x7a3b9c2f1e8d4a6b5c0f9e2d1a8b7c6d5e4f3a2b',
    network: 'Ethereum',
    scannedAt: '2026-06-10T10:24:00Z',
    securityScore: 38,
    riskLevel: 'High Risk',
  },
  {
    id: 'scan-2',
    contractName: 'StakingRewards',
    address: '0x1f4e9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
    network: 'Arbitrum',
    scannedAt: '2026-06-09T16:02:00Z',
    securityScore: 82,
    riskLevel: 'Low Risk',
  },
  {
    id: 'scan-3',
    contractName: 'GovernanceToken',
    address: '0x9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    network: 'Polygon',
    scannedAt: '2026-06-08T09:41:00Z',
    securityScore: 94,
    riskLevel: 'Safe',
  },
  {
    id: 'scan-4',
    contractName: 'FlashLoanArb',
    address: '0x3e2f1a0b9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d',
    network: 'BNB Chain',
    scannedAt: '2026-06-07T22:13:00Z',
    securityScore: 21,
    riskLevel: 'Critical',
  },
  {
    id: 'scan-5',
    contractName: 'NFTMarketplace',
    address: '0x5c4d3e2f1a0b9c8b7a6d5e4f3a2b1c0d9e8f7a6b',
    network: 'Base',
    scannedAt: '2026-06-06T11:55:00Z',
    securityScore: 67,
    riskLevel: 'Medium Risk',
  },
  {
    id: 'scan-6',
    contractName: 'TimelockController',
    address: '0x2b1c0d9e8f7a6b5c4d3e2f1a0b9c8b7a6d5e4f3a',
    network: 'Ethereum',
    scannedAt: '2026-06-05T14:30:00Z',
    securityScore: 88,
    riskLevel: 'Low Risk',
  },
];

export function getScanById(id: string): ScanResult | null {
  if (id === DEMO_SCAN.id) return DEMO_SCAN;

  const entry = SCAN_HISTORY.find(h => h.id === id);
  if (!entry) return null;

  // Synthesize a full report from the lightweight history entry so every
  // history row links to a complete scan view.
  const score = entry.securityScore;
  const visibleVulns = SAMPLE_VULNS.filter(v => {
    if (score < 30) return true;
    if (score < 60) return v.severity !== 'critical';
    if (score < 85)
      return (
        v.severity === 'medium' || v.severity === 'low' || v.severity === 'info'
      );
    return v.severity === 'low' || v.severity === 'info';
  });

  const critical = visibleVulns.filter(v => v.severity === 'critical').length;
  const gas = visibleVulns.filter(
    v => v.category === 'Gas Optimization',
  ).length;
  const quality = visibleVulns.filter(
    v => v.category === 'Code Quality',
  ).length;

  return {
    id: entry.id,
    contractName: entry.contractName,
    address: entry.address,
    network: entry.network,
    scannedAt: entry.scannedAt,
    securityScore: score,
    riskLevel: entry.riskLevel,
    totalVulnerabilities: visibleVulns.length,
    criticalIssues: critical,
    gasIssues: gas,
    qualityIssues: quality,
    complexity: Math.max(20, 100 - score),
    verified: score >= 60,
    vulnerabilities: visibleVulns,
    breakdown: [
      { label: 'Access Control', score: Math.min(100, score + 5) },
      { label: 'Reentrancy', score: Math.max(10, score - 15) },
      { label: 'Arithmetic', score: Math.min(100, score + 20) },
      { label: 'Randomness', score: Math.max(10, score - 5) },
      { label: 'Best Practices', score: Math.min(100, score + 10) },
      { label: 'Gas', score: Math.min(100, score + 15) },
    ],
    trend: [
      { label: 'v1', score: Math.max(5, score - 18) },
      { label: 'v2', score: Math.max(5, score - 10) },
      { label: 'v3', score: Math.max(5, score - 4) },
      { label: 'v4', score },
    ],
  };
}

export function shortAddress(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}\u2026${addr.slice(-4)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
