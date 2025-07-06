# Quality Attributes Specification

## Time Behaviour
Ensures fast connection and simulation execution.

### Response Time
**Importance:** Critical for user productivity.

#### Test: Runner Connection Latency
- **Scenario:** User connects to runner.
- **Response:** Connection within 500ms.
- **Execution:**
    1. Simulate 100 concurrent connections.
    2. Measure 95th percentile response time.

#### Test: Simulation Speed
- **Scenario:** User submits circuit.
- **Response:** Simulation completes in ≤2s (50 concurrent).
- **Execution:**
    1. Run 50 medium-complexity circuits.
    2. Verify 90% meet deadline.

## Fault Tolerance
Handles faulty inputs gracefully.

### Robustness
**Importance:** Prevents crashes on invalid inputs.

#### Test: Malformed Circuits
- **Scenario:** Submit invalid circuit.
- **Response:** Descriptive error, no crash.
- **Execution:**
    1. Send 10 malformed circuits.
    2. Check error responses.

#### Test: Memory Overflow
- **Scenario:** Submit memory-heavy circuit.
- **Response:** Process terminated, others unaffected.
- **Execution:**
    1. Run 4GB circuit + 10 normal ones.
    2. Verify isolation.

## Scalability
Handles load without degradation.

### Horizontal Scaling
**Importance:** Maintains performance at peak.

#### Test: Peak Load
- **Scenario:** 1000 concurrent users.
- **Response:** ≤5s latency, auto-scales.
- **Execution:**
    1. Stress-test cluster.
    2. Monitor scaling metrics.

#### Test: Instance Failure
- **Scenario:** Runner crashes mid-task.
- **Response:** Failover to another runner.
- **Execution:**
    1. Kill runner during simulation.
    2. Verify completion elsewhere.  