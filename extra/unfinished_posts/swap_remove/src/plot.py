import itertools
import multiprocessing
import subprocess
from pathlib import Path

import matplotlib.pyplot as plt

area_width = 1000
area_height = 1000
benchmark_iterations = 10


def main():
    plt.title("Circle packing algorithms")
    plt.xlabel("Radius")
    plt.ylabel("Milliseconds")

    radii = (0, 1, 10, 100, 1000)

    algorithms = ("NAIVE", "SHUFFLE", "SWAP_REMOVE", "SET", "UNORDERED_SET")

    Path("bin").mkdir(exist_ok=True)

    pool = multiprocessing.Pool(4)
    product = list(itertools.product(algorithms, radii))
    pool.map(compile_test, product)

    for i, algorithm_timings in enumerate(batched(pool.map(run_test, product), 5)):
        plt.plot(radii, algorithm_timings, label=algorithms[i])

    plt.xscale("log")
    # plt.yscale("log")

    plt.legend()  # Shows labels
    # plt.show()
    plt.savefig("plot.png")


def compile_test(tup):
    algorithm, radius = tup
    print(f"compiling {algorithm} with a radius of {radius}")

    completed_process = subprocess.run(
        [
            "c++",
            "main.cpp",
            "-Wall",
            "-Wextra",
            "-Werror",
            "-Wpedantic",
            "-Wshadow",
            "-Wfatal-errors",
            "-g",
            # "-fsanitize=address,undefined",
            "-O3",
            "-march=native",
            "-std=c++20",
            f"-DALGORITHM={algorithm}",
            f"-DRADIUS={radius}",
            f"-DAREA_WIDTH={area_width}",
            f"-DAREA_HEIGHT={area_height}",
            "-DCIRCLE_PACKING",
            "-DPRINT_TIME_ONLY",
            f"-DBENCHMARK_ITERATIONS={benchmark_iterations}",
            f"-obin/{algorithm}_{radius}",
        ]
    )
    assert completed_process.returncode == 0


def run_test(tup):
    algorithm, radius = tup
    print(f"running {algorithm} with a radius of {radius}")
    completed_process = subprocess.run(
        [f"bin/{algorithm}_{radius}"], capture_output=True
    )
    assert completed_process.returncode == 0
    return int(completed_process.stdout)


def batched(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


if __name__ == "__main__":
    main()
