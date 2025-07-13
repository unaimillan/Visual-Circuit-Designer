# <div align="center">Automated tests</div> 

Automated testing is an important element of our development process. All test suites are run in a continuous integration and continuous delivery (CI/CD) process to ensure the stability and correctness of our project.

## <div align="center">Frameworks</div>

| Tool       | Usage                                |
|------------|--------------------------------------|
| **Jest**   | Frontend. Unit and integration tests |
| **PyTest** | Runner. Unit and integration tests   |

## <div align="center">Tests Location</div>

### Frontend

| Type        | Location                                                                                                        |
|-------------|-----------------------------------------------------------------------------------------------------------------|
| Unit        | [Link to Integration Tests](../../UI/src/components/utils/__tests__/integration_tests/runnerConnection.test.js) |
| Integration | [Link to Unit Tests](../../UI/src/components/utils/__tests__/unit tests)                                        |

To run frontend tests, type in terminal:

```bash
  cd UI
  npm install
  npm test
```

### Runner
| Type        | Location                                                              |
|-------------|-----------------------------------------------------------------------|
| Unit        | [Link to Integration Tests](../../RunnerNode/tests/integration_tests) |
| Integration | [Link to Unit Tests](../../RunnerNode/tests/unit_tests)               |

To run runner tests: 
1. **Install Icarus Verilog**

   This part depends on what operating system the user has.
- For _Linux_:

  Type in terminal:
```bash
    sudo apt-get update
    sudo apt-get install -y iverilog
```
- For _macOS_:

  Type in terminal
```bash
    sudo port install iverilog
```
- For _Windows_:

  Install Icarus Verilog from this [site](https://bleyer.org/icarus/)

2. **Update** `pip`

  In terminal type:
```bash
  python -m pip install --upgrade pip
```
3. **Installing Python Dependencies**

  In terminal type:
```bash
  pip install -r RunnerNode/requirements.txt
```

4. **Running tests**

  In terminal type:
```bash
  PYTHONPATH=RunnerNode pytest RunnerNode/tests/
```