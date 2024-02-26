# Stop using SIGCHLD handlers for reaping

- StackOverflow and QT documentation recommend a `SIGCHLD` handler that writes a byte into a pipe that is detected by `poll()`
- The only way I know to do it properly when limited to using `poll()` is by giving it a timeout and using `WNOHANG` in `waitpid()`
