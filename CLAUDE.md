# CLAUDE.md - AI Assistant Guide for Joe V2 Liquidity Book

This document provides comprehensive guidance for AI assistants working on the Joe V2 Liquidity Book codebase.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Repository Structure](#repository-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Testing Guidelines](#testing-guidelines)
7. [Architecture Patterns](#architecture-patterns)
8. [Common Tasks](#common-tasks)
9. [Security Considerations](#security-considerations)
10. [Deployment](#deployment)

---

## Project Overview

**Project Name:** Joe V2 Liquidity Book
**Type:** Decentralized Exchange (DEX) Protocol
**Networks:** Avalanche (primary), Arbitrum
**License:** MIT

### What is Joe V2?

Joe V2 is a concentrated liquidity DEX protocol that uses discrete price ranges called "bins" for capital-efficient trading. It implements a custom token standard (LBToken) similar to ERC-1155 but optimized for liquidity positions without callbacks.

### Core Contracts (6 main contracts, 4,219 lines)

1. **LBPair.sol** (1,114 lines) - Core pair logic for swaps, liquidity, fees, and oracle
2. **LBRouter.sol** (1,149 lines) - User-facing entry point with security checks
3. **LBFactory.sol** (756 lines) - Pair creation and registry management
4. **LBQuoter.sol** (520 lines) - Best route finder for swaps
5. **LBToken.sol** (261 lines) - Multi-token standard for liquidity positions
6. **LBBaseHooks.sol** (419 lines) - Base implementation for protocol hooks

### Documentation References
- [Official Docs](https://docs.traderjoexyz.com/)
- [Whitepaper](https://github.com/traderjoe-xyz/LB-Whitepaper/blob/main/Joe%20v2%20Liquidity%20Book%20Whitepaper.pdf)

---

## Technology Stack

### Primary Technologies
- **Language:** Solidity ^0.8.20
- **Build Tool:** Foundry (Forge)
- **Test Framework:** Forge Test
- **EVM Version:** Paris
- **Optimizer:** Enabled (800 runs)

### Dependencies (via git submodules)
```
lib/
├── forge-std/                    # Foundry standard library
├── openzeppelin-contracts/       # Standard ERC20, AccessControl
└── openzeppelin-contracts-upgradeable/
```

### Import Remappings
```
forge-std/=lib/forge-std/src/
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/
```

---

## Repository Structure

```
joe-v2/
├── src/                          # Source contracts
│   ├── LBPair.sol               # Core pair implementation
│   ├── LBFactory.sol            # Factory for pair creation
│   ├── LBRouter.sol             # User-facing router
│   ├── LBQuoter.sol             # Route optimization
│   ├── LBToken.sol              # Multi-token standard
│   ├── LBBaseHooks.sol          # Hook base implementation
│   ├── interfaces/              # 15 interface files
│   │   ├── ILBPair.sol, ILBFactory.sol, ILBRouter.sol
│   │   ├── ILBToken.sol, ILBHooks.sol
│   │   └── Legacy interfaces (v2.0, v2.1, Joe v1)
│   └── libraries/               # 13 core libraries
│       ├── BinHelper.sol        # Bin operations
│       ├── FeeHelper.sol        # Fee calculations
│       ├── OracleHelper.sol     # TWAP oracle
│       ├── PairParameterHelper.sol
│       ├── Hooks.sol            # Hook management
│       ├── Constants.sol        # Global constants
│       ├── TokenHelper.sol      # ERC20 utilities
│       ├── Clone.sol, ImmutableClone.sol
│       └── math/                # 9 math libraries
│           ├── SafeCast.sol, Uint256x256Math.sol
│           ├── PackedUint128Math.sol, Uint128x128Math.sol
│           ├── BitMath.sol, TreeMath.sol
│           └── LiquidityConfigurations.sol
│
├── test/                        # 44 test files
│   ├── LBFactory.t.sol          # Factory tests
│   ├── LBPairSwap.t.sol         # Swap functionality
│   ├── LBPairLiquidity.t.sol    # Liquidity operations
│   ├── LBPairFees.t.sol         # Fee calculations
│   ├── LBPairHooks.t.sol        # Hook tests
│   ├── LBRouter.*.t.sol         # Router tests
│   ├── LBToken.t.sol            # Token tests
│   ├── libraries/               # Library unit tests
│   ├── integration/             # Integration tests
│   │   └── Addresses.sol        # Network addresses
│   ├── helpers/
│   │   ├── TestHelper.sol       # Base test class
│   │   └── Utils.sol
│   └── mocks/                   # Mock contracts
│
├── script/                      # Deployment scripts
│   ├── deploy-core.s.sol        # Core deployment
│   └── config/
│       ├── bips-config.sol      # Fee configurations
│       └── deployments.json     # Network addresses
│
├── Configuration Files
│   ├── foundry.toml             # Forge configuration
│   ├── remappings.txt           # Import mappings
│   ├── .prettierrc              # Code formatter
│   ├── .solhint.json            # Linter config
│   ├── slither.config.json      # Static analyzer
│   └── .env.example             # Environment template
│
└── Documentation
    ├── README.md
    ├── CLAUDE.md                # This file
    └── LICENSE
```

---

## Development Workflow

### Initial Setup

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test
```

### Environment Configuration

Create `.env` from `.env.example`:
```bash
PRIVATE_KEY="your-private-key"
SNOWTRACE_API_KEY="your-snowtrace-api"
RPC_MAINNET_URL="https://api.avax.network/ext/bc/C/rpc"
RPC_TESTNET_URL="https://api.avax-test.network/ext/bc/C/rpc"
```

### Common Commands

```bash
# Build
forge build

# Run all tests
forge test

# Run specific test file
forge test --match-path test/LBPair.t.sol

# Run specific test function
forge test --match-test testSwap

# Run with verbosity
forge test -vvv

# Generate coverage
forge coverage

# Format code
forge fmt

# Static analysis (requires Slither)
slither .
```

### Git Workflow

**Current Branch:** `claude/add-claude-documentation-3v2JX`

**Commit Message Conventions:**
- Use clear, descriptive messages
- Common prefixes: `Add`, `Update`, `Fix`, `Refactor`
- Example: `Fix composition fee calculation in LBPair`
- Example: `Update natspec for LBQuoter functions`

**Recent Focus Areas:**
- NatSpec documentation improvements
- Composition fee calculations
- Hook system enhancements
- Multi-version support (v2.1, v2.2)

---

## Code Conventions

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Custom Errors** | `Contract__ErrorName` | `LBPair__InsufficientAmountOut` |
| **Private/Internal** | `_variableName` | `_bins`, `_reserves`, `_parameters` |
| **Public Functions** | `functionName()` | `swap()`, `mint()`, `burn()` |
| **Internal Functions** | `_internalFunction()` | `_onlyFactory()`, `_checkLength()` |
| **Constants** | `CONSTANT_NAME` | `MAX_TOTAL_FEE`, `SCALE_OFFSET` |
| **Interfaces** | `IContractName` | `ILBPair`, `ILBFactory` |

### Solidity Style Guide

**File Structure:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Imports (grouped: external, internal)
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILBPair} from "./interfaces/ILBPair.sol";

/// @title ContractName
/// @notice Clear description of contract purpose
/// @dev Implementation details
contract ContractName {
    // Type declarations
    using LibraryName for Type;

    // State variables
    uint256 private _variableName;

    // Events
    event EventName(uint256 indexed id);

    // Errors
    error Contract__ErrorName();

    // Modifiers
    modifier onlyAuthorized() {
        // ...
    }

    // Functions (in order: constructor, receive, external, public, internal, private)
}
```

**Formatting (Prettier Config):**
- Print width: 120 characters
- Tab width: 4 spaces
- Use spaces (not tabs)
- No semicolons at end of statements
- No bracket spacing: `{x: 1}` not `{ x: 1 }`

### Common Modifiers

```solidity
onlyFactory()                  // Restrict to factory calls
onlyProtocolFeeRecipient()     // Restrict to fee recipient
onlyTrustedCaller()            // For hooks
ensure(deadline)               // Deadline validation (router)
verifyPathValidity()           // Path structure validation
```

### Error Handling

**Always use custom errors (not string reverts):**
```solidity
// Good
error LBPair__InsufficientAmountOut(uint256 amountOut, uint256 amountOutMin);
if (amountOut < amountOutMin) revert LBPair__InsufficientAmountOut(amountOut, amountOutMin);

// Bad
require(amountOut >= amountOutMin, "Insufficient amount out");
```

### Gas Optimization Patterns

1. **Packed Storage:**
```solidity
// Use PackedUint128Math for combining uint128 values
bytes32 packed = PackedUint128Math.encode(uint128(x), uint128(y));
```

2. **Unchecked Arithmetic (when safe):**
```solidity
unchecked {
    ++i;  // Use when overflow impossible
}
```

3. **Immutable/Constant:**
```solidity
address private immutable _factory;
uint256 private constant SCALE = 1e18;
```

4. **Library Usage:**
```solidity
using BinHelper for bytes32;
using TokenHelper for IERC20;
```

---

## Testing Guidelines

### Test Organization

**Base Test Class:** `test/helpers/TestHelper.sol`
- Provides common setup and fixtures
- Mock tokens: USDC (6 decimals), USDT, WBTC (8), WETH, BNB, LINK (18)
- Test accounts: DEV, ALICE, BOB
- Pre-initialized Factory, Router, Quoter

**Test Inheritance:**
```solidity
import {TestHelper} from "./helpers/TestHelper.sol";

contract MyTest is TestHelper {
    function setUp() public override {
        super.setUp();
        // Additional setup
    }
}
```

### Test Types

1. **Unit Tests** - Test individual functions in isolation
   - Location: `test/libraries/` for library tests
   - Example: `test/libraries/BinHelper.t.sol`

2. **Integration Tests** - Test contract interactions
   - Location: `test/integration/`
   - Example: `test/integration/LBQuoter.t.sol`

3. **Fuzz Tests** - Property-based testing
   - Configuration: 1024 runs (foundry.toml)
   - Use `vm.assume()` to constrain inputs

### Test Naming Conventions

```solidity
// Test function names should be descriptive
function testSwapExactTokensForTokens() public { }
function testSwapRevertsIfInsufficientOutput() public { }
function testFuzz_AddLiquidity(uint256 amount) public { }
```

### Common Test Patterns

**Setup Pattern:**
```solidity
function setUp() public override {
    super.setUp();

    // Create pair
    pair = createLBPairDefaultFees(token6D, token18D);

    // Add liquidity
    addLiquidity(amountX, amountY, activeId, numberBins);
}
```

**Assertion Pattern:**
```solidity
// Check balances
assertEq(token.balanceOf(alice), expectedBalance, "Balance mismatch");

// Check reverts with custom error
vm.expectRevert(
    abi.encodeWithSelector(
        LBPair__InsufficientAmountOut.selector,
        amountOut,
        amountOutMin
    )
);
pair.swap(false, alice);
```

**Mock Usage:**
```solidity
// Use mocks from test/mocks/
ERC20 mockToken = new ERC20("Mock", "MCK", 18);
MockHooks mockHooks = new MockHooks();
```

### Test Constants

```solidity
uint16 constant DEFAULT_BIN_STEP = 10;           // 10 basis points
uint16 constant DEFAULT_BASE_FACTOR = 5_000;
uint16 constant DEFAULT_FILTER_PERIOD = 30;
uint16 constant DEFAULT_DECAY_PERIOD = 600;
uint256 constant DEFAULT_FLASHLOAN_FEE = 8e14;
```

---

## Architecture Patterns

### Core Design Patterns

#### 1. Factory Pattern
```
LBFactory.createLBPair()
  → Deploys new LBPair via ImmutableClone
  → Registers pair in mapping
  → Emits LBPairCreated event
```

#### 2. Router Pattern
```
User → LBRouter → Validates → LBPair
                 ↓
              Manages tokens
              Checks slippage
              Handles multi-hop swaps
```

#### 3. Hook System
```
LBPair operation
  → Check if hooks enabled
  → Call hook via ILBHooks interface
  → Revert if hook fails (depending on flags)
  → Continue with operation
```

### Data Flow Patterns

**Swap Flow:**
```
1. User calls LBRouter.swapExactTokensForTokens()
2. Router validates path and amounts
3. Router transfers tokens from user
4. Router calls LBPair.swap()
5. LBPair:
   - Calculates amounts across bins
   - Applies fees (static + variable)
   - Executes hooks (if enabled)
   - Updates oracle
   - Transfers output tokens
6. Router validates slippage
7. Router transfers tokens to user
```

**Liquidity Addition Flow:**
```
1. User calls LBRouter.addLiquidity()
2. Router validates parameters
3. Router transfers tokens from user
4. Router calls LBPair.mint()
5. LBPair:
   - Distributes liquidity across bins
   - Mints LBToken shares
   - Executes hooks (if enabled)
   - Updates reserves
6. Router returns actual amounts added
```

### Key Architectural Concepts

#### Bins (Discrete Liquidity)
- Each bin represents a specific price point
- Bin ID determines the price: `price = (1 + binStep / 10000) ^ (binId - 8388608)`
- Active bin is the current trading price
- Liquidity concentrated in bins around active price

#### Fee Structure
- **Static Fee:** Base fee set by preset
- **Variable Fee:** Dynamic fee based on volatility
- **Total Fee:** Static + Variable (capped at MAX_TOTAL_FEE)
- **Protocol Fee:** Percentage of total fee for protocol

#### Oracle (TWAP)
- Time-Weighted Average Price tracking
- Samples stored in circular buffer
- Used for price feed and volatility calculation
- Accessed via `OracleHelper` library

#### LBToken (Multi-Token Standard)
- Similar to ERC-1155 but optimized
- Each bin has a unique token ID
- No callbacks (safer than ERC-1155)
- Batch operations supported
- Used to track liquidity positions

---

## Common Tasks

### Adding New Functionality

**Before making changes:**
1. Read relevant contracts and tests
2. Understand existing patterns
3. Check for similar implementations
4. Review security implications

**When adding features:**
```bash
# 1. Create/modify contract
vim src/ContractName.sol

# 2. Add comprehensive tests
vim test/ContractName.t.sol

# 3. Build and test
forge build
forge test --match-path test/ContractName.t.sol

# 4. Check coverage
forge coverage

# 5. Run static analysis
slither .

# 6. Format code
forge fmt
```

### Modifying Existing Contracts

**Critical Files (high impact):**
- `src/LBPair.sol` - Core pair logic (handle with care)
- `src/LBRouter.sol` - User entry point (security critical)
- `src/LBFactory.sol` - Pair creation (affects all pairs)

**Before modifying:**
1. Read the entire file first
2. Check all tests related to the file
3. Understand dependencies (imports, inheritance)
4. Look for similar code patterns in the codebase

**After modifying:**
1. Update or add tests for your changes
2. Run full test suite: `forge test`
3. Update NatSpec documentation
4. Check gas usage: `forge test --gas-report`
5. Run Slither if security-relevant

### Working with Libraries

**Key Libraries:**

| Library | File Location | Purpose |
|---------|--------------|---------|
| BinHelper | `src/libraries/BinHelper.sol` | Bin calculations, composition, amounts |
| FeeHelper | `src/libraries/FeeHelper.sol` | Static and variable fee calculations |
| OracleHelper | `src/libraries/OracleHelper.sol` | TWAP oracle management |
| PairParameterHelper | `src/libraries/PairParameterHelper.sol` | Fee parameter encoding/decoding |
| Hooks | `src/libraries/Hooks.sol` | Hook system management |
| SafeCast | `src/libraries/math/SafeCast.sol` | Safe type casting |
| Uint256x256Math | `src/libraries/math/Uint256x256Math.sol` | Fixed-point 256x256 math |
| PackedUint128Math | `src/libraries/math/PackedUint128Math.sol` | Packed uint128 operations |

**Using Libraries:**
```solidity
import {BinHelper} from "./libraries/BinHelper.sol";

contract MyContract {
    using BinHelper for bytes32;

    function myFunction(bytes32 binReserves) public {
        (uint128 reserveX, uint128 reserveY) = binReserves.decode();
        // ...
    }
}
```

### Adding Tests

**Test Template:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TestHelper} from "./helpers/TestHelper.sol";
import {ContractToTest} from "../src/ContractToTest.sol";

contract ContractToTestTest is TestHelper {
    ContractToTest public contractInstance;

    function setUp() public override {
        super.setUp();
        contractInstance = new ContractToTest();
    }

    function testBasicFunctionality() public {
        // Arrange
        uint256 input = 100;

        // Act
        uint256 result = contractInstance.someFunction(input);

        // Assert
        assertEq(result, expectedValue, "Result should match expected");
    }

    function testRevertCondition() public {
        // Arrange
        uint256 invalidInput = 0;

        // Act & Assert
        vm.expectRevert(ContractToTest__InvalidInput.selector);
        contractInstance.someFunction(invalidInput);
    }

    function testFuzz_Function(uint256 amount) public {
        // Constrain fuzz inputs
        vm.assume(amount > 0 && amount < type(uint128).max);

        // Test property
        uint256 result = contractInstance.someFunction(amount);
        assertGe(result, amount, "Result should be >= input");
    }
}
```

### Debugging Failed Tests

```bash
# Run with maximum verbosity
forge test --match-test testName -vvvv

# Show gas usage
forge test --gas-report

# Show stack traces
forge test -vvvv --show-progress

# Run single test
forge test --match-test testSpecificFunction -vvv
```

---

## Security Considerations

### Critical Security Patterns

#### 1. Reentrancy Protection
```solidity
// LBPair uses ReentrancyGuardUpgradeable
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract LBPair is ReentrancyGuardUpgradeable {
    function swap() external nonReentrant {
        // Safe from reentrancy
    }
}
```

#### 2. Checks-Effects-Interactions (CEI)
```solidity
function withdraw(uint256 amount) external {
    // Checks
    require(balances[msg.sender] >= amount);

    // Effects
    balances[msg.sender] -= amount;

    // Interactions
    token.transfer(msg.sender, amount);
}
```

#### 3. Safe Casting
```solidity
import {SafeCast} from "./libraries/math/SafeCast.sol";

// Always use SafeCast for downcasting
uint128 amount = amount256.safe128();  // Reverts if overflow
```

#### 4. Input Validation
```solidity
// Validate all external inputs
function addLiquidity(uint256[] calldata amounts) external {
    if (amounts.length == 0) revert LBRouter__EmptyAmounts();
    if (amounts.length > MAX_BINS) revert LBRouter__TooManyBins();
    // ...
}
```

#### 5. Flash Loan Callback Verification
```solidity
// Verify callback sender
bytes32 expectedHash = keccak256(abi.encode(msg.sender, params));
if (callbackHash != expectedHash) revert LBPair__InvalidCallback();
```

### Security Checklist

**Before committing code:**
- [ ] No reentrancy vulnerabilities (use `nonReentrant` where needed)
- [ ] Follow CEI pattern in state-changing functions
- [ ] Use SafeCast for all downcasting operations
- [ ] Validate all external inputs
- [ ] Check for integer overflow/underflow (use Solidity 0.8+ or SafeMath)
- [ ] Verify callback senders in flash loans
- [ ] Ensure access control modifiers are applied correctly
- [ ] No division by zero possibilities
- [ ] Check array bounds before access
- [ ] Consider MEV/front-running implications
- [ ] Verify token transfers succeeded (use TokenHelper)
- [ ] Update NatSpec documentation for security assumptions

### Common Vulnerabilities to Avoid

**1. Integer Overflow/Underflow:**
```solidity
// Solidity 0.8.20 has built-in overflow protection
// Use unchecked only when absolutely safe
unchecked {
    ++i;  // OK in loop when i < array.length
}
```

**2. Reentrancy:**
```solidity
// Bad: External call before state update
token.transfer(user, amount);
balances[user] -= amount;

// Good: State update before external call
balances[user] -= amount;
token.transfer(user, amount);
```

**3. Front-Running:**
```solidity
// Mitigate with deadline and slippage protection
function swap(uint256 amountOutMin, uint256 deadline) external {
    if (block.timestamp > deadline) revert LBRouter__DeadlineExceeded();
    if (amountOut < amountOutMin) revert LBRouter__InsufficientAmountOut();
    // ...
}
```

**4. Access Control:**
```solidity
// Always use modifiers for access control
modifier onlyFactory() {
    if (msg.sender != address(_factory)) revert LBPair__OnlyFactory();
    _;
}
```

### Security Tools

**Static Analysis:**
```bash
# Run Slither (install: pip3 install slither-analyzer)
slither .

# Configuration in slither.config.json filters lib/, test/, script/
```

**Linting:**
```bash
# Solhint is configured in .solhint.json
# Prettier handles formatting via forge fmt
forge fmt --check  # Check formatting without changes
forge fmt          # Apply formatting
```

---

## Deployment

### Deployment Networks

**Configured Networks:**
- Avalanche Mainnet (43114)
- Avalanche Fuji Testnet (43113)
- Arbitrum One (42161)
- Arbitrum Goerli (421613)

### Deployment Script

**Location:** `script/deploy-core.s.sol`

**Deployment Order:**
1. LBFactory
2. LBPair implementation (not directly used, cloned by factory)
3. LBRouter
4. LBQuoter
5. Configure presets and quote assets
6. Transfer ownership to multisig

**Running Deployment:**
```bash
# Testnet deployment
forge script script/deploy-core.s.sol:DeployCore \
    --rpc-url $RPC_TESTNET_URL \
    --broadcast \
    --verify

# Mainnet deployment
forge script script/deploy-core.s.sol:DeployCore \
    --rpc-url $RPC_MAINNET_URL \
    --broadcast \
    --verify
```

### Deployed Addresses (Avalanche)

From `test/integration/Addresses.sol`:

**Joe V2.2 (Current):**
- Factory: `0x6E77932A92582f504FF6c4BdbCef7Da6c198aEEf`
- Router: `0xE3Ffc583dC176575eEA7FD9dF2A7c65F7E23f4C3`

**Joe V2.1:**
- Factory: `0x8e42f2F4101563bF679975178e880FD87d3eFd4e`
- Router: `0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30`

**Joe V1 (Legacy):**
- Factory: `0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10`
- Router: `0x60aE616a2155Ee3d9A68541Ba4544862310933d4`

**Native Token:**
- WNATIVE (WAVAX): `0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7`

### Contract Verification

```bash
# Verify on Snowtrace (Avalanche)
forge verify-contract \
    --chain avalanche \
    --compiler-version v0.8.20 \
    --optimizer-runs 800 \
    <CONTRACT_ADDRESS> \
    src/LBFactory.sol:LBFactory

# Verify on Arbiscan (Arbitrum)
forge verify-contract \
    --chain arbitrum \
    --compiler-version v0.8.20 \
    --optimizer-runs 800 \
    <CONTRACT_ADDRESS> \
    src/LBFactory.sol:LBFactory
```

### Post-Deployment Checklist

- [ ] Verify all contracts on block explorer
- [ ] Transfer ownership to multisig
- [ ] Configure fee presets
- [ ] Add quote assets
- [ ] Test basic operations (create pair, add liquidity, swap)
- [ ] Monitor gas costs
- [ ] Update documentation with new addresses
- [ ] Notify integrators of new deployment

---

## Working as an AI Assistant

### Best Practices for AI Assistants

#### 1. Always Read Before Modifying
```
❌ Don't: Suggest changes to files you haven't read
✅ Do: Use Read tool to understand current implementation
✅ Do: Check related test files
✅ Do: Look for similar patterns in codebase
```

#### 2. Understand Context
```
❌ Don't: Make isolated changes without understanding dependencies
✅ Do: Check imports and inheritance
✅ Do: Review interfaces and their implementations
✅ Do: Consider impact on other contracts
```

#### 3. Maintain Consistency
```
❌ Don't: Introduce new patterns inconsistent with codebase
✅ Do: Follow existing naming conventions
✅ Do: Use established error handling patterns
✅ Do: Match code style (formatting, structure)
```

#### 4. Test Thoroughly
```
❌ Don't: Submit code without tests
✅ Do: Add unit tests for new functionality
✅ Do: Add integration tests for contract interactions
✅ Do: Run full test suite before committing
✅ Do: Check gas usage implications
```

#### 5. Document Changes
```
❌ Don't: Leave code without documentation
✅ Do: Update NatSpec comments
✅ Do: Add inline comments for complex logic
✅ Do: Update README if user-facing changes
✅ Do: Write clear commit messages
```

### File Reference Format

When referencing code locations, use: `file_path:line_number`

Examples:
- `src/LBPair.sol:450` - Swap function
- `src/libraries/BinHelper.sol:120` - Composition calculation
- `test/LBPairSwap.t.sol:89` - Swap test

### Quick Reference Commands

```bash
# Find contract definitions
forge inspect ContractName abi

# Find function selectors
forge inspect ContractName methods

# Find storage layout
forge inspect ContractName storage-layout

# Search for usage
grep -r "functionName" src/

# Find all implementations of interface
grep -r "is IInterfaceName" src/
```

### Key Files to Review First

**For Swap-Related Changes:**
1. `src/LBPair.sol` (core swap logic)
2. `src/LBRouter.sol` (router entry point)
3. `src/libraries/BinHelper.sol` (bin calculations)
4. `src/libraries/FeeHelper.sol` (fee calculations)
5. `test/LBPairSwap.t.sol` (swap tests)

**For Liquidity-Related Changes:**
1. `src/LBPair.sol` (mint/burn functions)
2. `src/LBRouter.sol` (addLiquidity/removeLiquidity)
3. `src/LBToken.sol` (share tracking)
4. `test/LBPairLiquidity.t.sol` (liquidity tests)

**For Fee-Related Changes:**
1. `src/libraries/FeeHelper.sol` (fee calculations)
2. `src/libraries/PairParameterHelper.sol` (fee parameters)
3. `src/LBFactory.sol` (fee presets)
4. `test/LBPairFees.t.sol` (fee tests)

**For Hook-Related Changes:**
1. `src/LBBaseHooks.sol` (base implementation)
2. `src/libraries/Hooks.sol` (hook management)
3. `src/interfaces/ILBHooks.sol` (hook interface)
4. `test/LBPairHooks.t.sol` (hook tests)

---

## Glossary

**Active Bin:** The bin containing the current trading price

**Bin:** A discrete price point where liquidity can be deposited

**Bin Step:** The price increment between adjacent bins (in basis points)

**Composition Fee:** Fee paid when liquidity composition differs from current reserves

**LBToken:** Multi-token standard for tracking liquidity positions (similar to ERC-1155)

**Oracle:** Time-Weighted Average Price (TWAP) tracker built into LBPair

**Quote Asset:** Whitelisted token that can be used as quote side in pairs

**Static Fee:** Base fee component (set by preset)

**Variable Fee:** Dynamic fee component based on volatility

**WNATIVE:** Wrapped native token (WAVAX on Avalanche, WETH on Ethereum/Arbitrum)

---

## Additional Resources

### External Documentation
- [Trader Joe Docs](https://docs.traderjoexyz.com/)
- [Liquidity Book Whitepaper](https://github.com/traderjoe-xyz/LB-Whitepaper/blob/main/Joe%20v2%20Liquidity%20Book%20Whitepaper.pdf)
- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Code Navigation Tips

**Find all pairs created:**
```solidity
// src/LBFactory.sol - _LBPairsInfo mapping
```

**Find fee calculation:**
```solidity
// src/libraries/FeeHelper.sol - getFeeAmount()
```

**Find swap implementation:**
```solidity
// src/LBPair.sol - swap() function (line ~450)
```

**Find oracle queries:**
```solidity
// src/libraries/OracleHelper.sol - getSampleAt()
```

---

## Questions or Issues?

When encountering issues:

1. **Check existing tests** - Similar functionality likely has tests
2. **Review related contracts** - Look for patterns and conventions
3. **Run tests with verbosity** - `forge test -vvvv` shows stack traces
4. **Check git history** - Recent commits may provide context
5. **Consult documentation** - README and external docs

---

**Last Updated:** 2025-12-30
**Codebase Version:** Joe V2.2
**Solidity Version:** 0.8.20
**Foundry Version:** Latest stable

