#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <random>
#include <ranges>
#include <set>
#include <string>
#include <unordered_set>
#include <vector>

#define AREA_SIZE (AREA_WIDTH * AREA_HEIGHT)
#define HALF_RADIUS (RADIUS / 2)

#define ALL 0
#define NAIVE 1
#define SHUFFLE 2
#define SWAP_REMOVE 3
#define SET 4
#define UNORDERED_SET 5

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

		int cx = ci % AREA_WIDTH;
		int cy = ci / AREA_WIDTH;

		for (int y = std::max(cy - RADIUS, 0); y <= std::min(cy + RADIUS, AREA_HEIGHT - 1); y++) {
			for (int x = std::max(cx - RADIUS, 0); x <= std::min(cx + RADIUS, AREA_WIDTH - 1); x++) {
#ifdef CIRCLE_PACKING
				int dx = x - cx;
				int dy = y - cy;
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int ni = x + y * AREA_WIDTH;

				if (!area[ni]) {
					area[ni] = true;

					open--;
				}
			}
		}
	}
}

void shuffle(std::vector<int> &centers, std::vector<bool> &area, std::vector<int> &open)
{
	centers.clear();

	std::fill(area.begin(), area.end(), 0);

	for (int i = 0; i < AREA_SIZE; i++) {
		open.push_back(i);
	}

	static auto rng = std::default_random_engine {};
	std::shuffle(open.begin(), open.end(), rng);

	while (open.size() > 0) {
		int ci = open.back();
		open.pop_back();

		if (area[ci]) {
			continue;
		}

		centers.push_back(ci);

		int cx = ci % AREA_WIDTH;
		int cy = ci / AREA_WIDTH;

		for (int y = std::max(cy - RADIUS, 0); y <= std::min(cy + RADIUS, AREA_HEIGHT - 1); y++) {
			for (int x = std::max(cx - RADIUS, 0); x <= std::min(cx + RADIUS, AREA_WIDTH - 1); x++) {
#ifdef CIRCLE_PACKING
				int dx = x - cx;
				int dy = y - cy;
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int ni = x + y * AREA_WIDTH;

				// TODO: Try removing if
				if (!area[ni]) {
					area[ni] = true;
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

		int cx = cv % AREA_WIDTH;
		int cy = cv / AREA_WIDTH;

		for (int y = std::max(cy - RADIUS, 0); y <= std::min(cy + RADIUS, AREA_HEIGHT - 1); y++) {
			for (int x = std::max(cx - RADIUS, 0); x <= std::min(cx + RADIUS, AREA_WIDTH - 1); x++) {
#ifdef CIRCLE_PACKING
				int dx = x - cx;
				int dy = y - cy;
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int nv = x + y * AREA_WIDTH;

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

template <class T>
void set(std::vector<int> &centers, T &open, const std::vector<int> &open_start)
{
	centers.clear();

	// TODO: Check the assembly of how inefficient this is
	open.clear();
	open.insert(open_start.begin(), open_start.end());

	while (!open.empty()) {
		int ci = rand() % AREA_SIZE; // Center index

		if (!open.contains(ci)) {
			continue;
		}

		centers.push_back(ci);

		int cx = ci % AREA_WIDTH;
		int cy = ci / AREA_WIDTH;

		for (int y = std::max(cy - RADIUS, 0); y <= std::min(cy + RADIUS, AREA_HEIGHT - 1); y++) {
			for (int x = std::max(cx - RADIUS, 0); x <= std::min(cx + RADIUS, AREA_WIDTH - 1); x++) {
#ifdef CIRCLE_PACKING
				int dx = x - cx;
				int dy = y - cy;
				if (dx * dx + dy * dy > RADIUS * RADIUS) { // Pythagorean theorem
					continue;
				}
#endif
				int ni = x + y * AREA_WIDTH;

				open.erase(ni);
			}
		}
	}
}

// clear && c++ main.cpp -Wall -Wextra -Werror -Wpedantic -Wshadow -Wfatal-errors -g -fsanitize=address,undefined -O3 -std=c++20 -DRADIUS=10 -DAREA_WIDTH=30 -DAREA_HEIGHT=30 -DCIRCLE_PACKING -DPRINT_CENTERS -DBENCHMARK_ITERATIONS=1 && ./a.out | sh fullwidth.sh
int main() {
	srand(time(NULL));

	std::vector<int> centers;

	#if ALGORITHM == NAIVE || ALGORITHM == ALL
	{
		std::vector<bool> area(AREA_SIZE);

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			naive(centers, area);
		}
		auto end = std::chrono::steady_clock::now();

		#ifdef PRINT_TIME_ONLY
			std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << std::endl;
		#else
			std::cout << "naive took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;
		#endif

		#ifdef PRINT_CENTERS
			print_centers(centers);
		#endif
	}
	#endif

	#if ALGORITHM == SHUFFLE || ALGORITHM == ALL
	{
		std::vector<bool> area(AREA_SIZE);

		std::vector<int> open;

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			shuffle(centers, area, open);
		}
		auto end = std::chrono::steady_clock::now();

		#ifdef PRINT_TIME_ONLY
			std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << std::endl;
		#else
			std::cout << "shuffle took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;
		#endif

		#ifdef PRINT_CENTERS
			print_centers(centers);
		#endif
	}
	#endif

	#if ALGORITHM == SWAP_REMOVE || ALGORITHM == ALL
	{
		std::vector<int> v2i(AREA_SIZE); // value-to-index
		std::vector<int> i2v(AREA_SIZE); // index-to-value

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			swap_remove(centers, v2i, i2v);
		}
		auto end = std::chrono::steady_clock::now();

		#ifdef PRINT_TIME_ONLY
			std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << std::endl;
		#else
			std::cout << "swap_remove took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;
		#endif

		#ifdef PRINT_CENTERS
			print_centers(centers);
		#endif
	}
	#endif

	#if ALGORITHM == SET || ALGORITHM == ALL
	{
		std::set<int> open;

		std::vector<int> open_start;

		for (int i = 0; i < AREA_SIZE; i++) {
			open_start.push_back(i);
		}

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			set(centers, open, open_start);
		}
		auto end = std::chrono::steady_clock::now();

		#ifdef PRINT_TIME_ONLY
			std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << std::endl;
		#else
			std::cout << "set took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;
		#endif

		#ifdef PRINT_CENTERS
			print_centers(centers);
		#endif
	}
	#endif

	#if ALGORITHM == UNORDERED_SET || ALGORITHM == ALL
	{
		std::unordered_set<int> open;

		std::vector<int> open_start;

		for (int i = 0; i < AREA_SIZE; i++) {
			open_start.push_back(i);
		}

		auto begin = std::chrono::steady_clock::now();
		for (int i = 0; i < BENCHMARK_ITERATIONS; i++)
		{
			set(centers, open, open_start);
		}
		auto end = std::chrono::steady_clock::now();

		#ifdef PRINT_TIME_ONLY
			std::cout << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << std::endl;
		#else
			std::cout << "unordered_set took " << std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count() << " ms doing " << BENCHMARK_ITERATIONS << " benchmark iterations" << std::endl;
		#endif

		#ifdef PRINT_CENTERS
			print_centers(centers);
		#endif
	}
	#endif
}
