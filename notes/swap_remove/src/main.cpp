#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <string>
#include <vector>

#define RADIUS 10
#define AREA_WIDTH 30
#define AREA_HEIGHT 30
#define CIRCLE_PACKING
#define PRINT_CENTERS
#define BENCHMARK_ITERATIONS 1

#define AREA_SIZE (AREA_WIDTH * AREA_HEIGHT)
#define HALF_RADIUS (RADIUS / 2)

void print_centers(const std::vector<int> &centers)
{
	// TODO: Print so that radius is taken into account by extending the edges of the area
	std::vector<int> area((AREA_WIDTH + RADIUS) * (AREA_HEIGHT + RADIUS));

	for (int ci : centers) {
		int x = ci % AREA_WIDTH;
		int y = ci / AREA_WIDTH;

		for (int dy = -HALF_RADIUS; dy <= HALF_RADIUS; dy++) { // Delta y
			for (int dx = -HALF_RADIUS; dx <= HALF_RADIUS; dx++) {
#ifdef CIRCLE_PACKING
				if (dx * dx + dy * dy > HALF_RADIUS * HALF_RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int nx = x + dx; // Neighbor x
				int ny = y + dy;

				int ni = (nx + HALF_RADIUS) + (ny + HALF_RADIUS) * (AREA_WIDTH + RADIUS);

				area[ni]++;
			}
		}

		area[(x + HALF_RADIUS) + (y + HALF_RADIUS) * (AREA_WIDTH + RADIUS)] = 2;
	}

	std::string output;

	for (int y = 0; y < AREA_HEIGHT + RADIUS; y++) {
		int y_offset = y * (AREA_WIDTH + RADIUS);

		std::string line;
		for (int x = 0; x < AREA_WIDTH + RADIUS; x++) {
			int v = area[x + y_offset];

			char c;
			if (v == 0) {
				c = '.';
			} else if (v == 1) {
				c = 'O';
			} else {
				c = '$';
			}

			line += c;
		}

		output += line + "\n";
	}

	std::cout << output << std::flush;
}

void naive(std::vector<int> &centers, std::vector<bool> &area)
{
	centers.clear();

	std::fill(area.begin(), area.end(), 0);

	int open = AREA_SIZE;

	while (open > 0) {
		int ci = rand() % AREA_SIZE; // Center index

		if (area[ci]) {
			continue;
		}

		centers.push_back(ci);

		int x = ci % AREA_WIDTH;
		int y = ci / AREA_WIDTH;

		for (int dy = -RADIUS; dy <= RADIUS; dy++) { // Delta y
			for (int dx = -RADIUS; dx <= RADIUS; dx++) {
#ifdef CIRCLE_PACKING
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int nx = x + dx; // Neighbor x
				int ny = y + dy;
				if (nx < 0 || nx >= AREA_WIDTH || ny < 0 || ny >= AREA_HEIGHT) {
					continue;
				}

				int ni = nx + ny * AREA_WIDTH;

				if (!area[ni]) {
					area[ni] = true;

					open--;
				}
			}
		}
	}
}

void swap_remove(std::vector<int> &centers, std::vector<int> &v2i, std::vector<int> &i2v)
{
	centers.clear();

	for (int i = 0; i < AREA_SIZE; i++) {
		v2i[i] = i;
		i2v[i] = i;
	}

	int open = AREA_SIZE;

	while (open > 0) {
		int ci = rand() % open; // Center index

		int cv = i2v[ci]; // Center value

		centers.push_back(cv);

		int x = cv % AREA_WIDTH;
		int y = cv / AREA_WIDTH;

		for (int dy = -RADIUS; dy <= RADIUS; dy++) { // Delta y
			for (int dx = -RADIUS; dx <= RADIUS; dx++) {
#ifdef CIRCLE_PACKING
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int nx = x + dx; // Neighbor x
				int ny = y + dy;
				if (nx < 0 || nx >= AREA_WIDTH || ny < 0 || ny >= AREA_HEIGHT) {
					continue;
				}

				int nv = nx + ny * AREA_WIDTH;

				int ni = v2i[nv];

				if (ni < open) {
					open--;

					int to_v = i2v[open];

					v2i[to_v] = ni;
					i2v[ni] = to_v;

					v2i[nv] = open;
					i2v[open] = nv;
				}
			}
		}
	}
}

// PRINT:
// clear && c++ main.cpp -Wall -Wextra -Werror -Wpedantic -Wshadow -Wfatal-errors -g -fsanitize=address,undefined -O3 && ./a.out | sh fullwidth.sh
// BENCHMARK:
// clear && c++ main.cpp -Wall -Wextra -Werror -Wpedantic -Wshadow -Wfatal-errors -g -fsanitize=address,undefined -O3 && ./a.out
int main() {
	srand(time(NULL));

	std::vector<int> centers;

	{
		std::vector<bool> area(AREA_SIZE);

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			naive(centers, area);
		}
		auto end = std::chrono::steady_clock::now();

		std::cout << "naive took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;

#ifdef PRINT_CENTERS
		print_centers(centers);
#endif
	}

	{
		std::vector<int> v2i(AREA_SIZE); // value-to-index
		std::vector<int> i2v(AREA_SIZE); // index-to-value

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			swap_remove(centers, v2i, i2v);
		}
		auto end = std::chrono::steady_clock::now();

		std::cout << "swap_remove took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;

#ifdef PRINT_CENTERS
		print_centers(centers);
#endif
	}
}
