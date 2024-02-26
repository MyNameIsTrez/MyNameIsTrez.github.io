#include <assert.h>
#include <poll.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdbool.h>
#include <errno.h>

// cc -Wall -Wextra -Werror timeout_reap.c && ./a.out
int main(void)
{
    int forks = 0;
    for (int i = 0; i < 1000; i++)
    {
        pid_t pid = fork();
        assert(pid != -1);
        if (pid == 0)
        {
            // Child process
            return EXIT_SUCCESS;
        }
        // Parent process
        forks++;
    }

    // You'd give these actual values in a real program
    struct pollfd *pfds = NULL;
    int nfds = 0;

    int timeout_ms = 1000;

    int reaped = 0;
    for (int i = 0; i < 5; i++)
    {
        int event_count = poll(pfds, nfds, timeout_ms);
        assert(event_count != -1);
        if (event_count == 0)
        {
            while (true)
            {
                int wstatus;
                pid_t child_pid = waitpid(-1, &wstatus, WNOHANG);

                // If there are no children at this moment
                if (errno == ECHILD)
                {
                    break;
                }
                // If the children aren't ready to be reaped yet
                if (child_pid == 0)
                {
                    break;
                }

                reaped++;
            }
        }
    }

    printf("%d out of %d forks were reaped\n", reaped, forks);

    return EXIT_SUCCESS;
}
