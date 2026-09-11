"""Check research examples and proposed math invariants; not a game/LLM test."""
from fractions import Fraction as F
from itertools import permutations
from pathlib import Path
import json
import math
import random


def ceil_fraction(x):
    return -(-x.numerator // x.denominator)


def rounded_nonnegative(x, step):
    return ((x + step / 2) // step) * step


checks = []


def example(label, actual, expected):
    assert actual == expected, (label, actual, expected)
    checks.append({"case": label, "answer": str(actual), "status": "passed"})


example("daily_1_product", F(3, 9) * F(2, 4), F(1, 6))
example("basic_11_strict_bus_capacity", 45 - 1 - 40, 4)
example("basic_14_rounding", rounded_nonnegative(F(5466, 1000), F(1, 10)), F(55, 10))
example("basic_17_minimum_notes", ceil_fraction(F(4700 + 3200 * 2, 1000)), 12)
example("level_10_flower_inverse", F(12, 1) / (1 - 2 * F(15, 31)) * F(15, 31), 180)
example("level_17_recover_wrong_operation", (F(23, 40) + F(1, 8)) * F(1, 8), F(7, 80))
example("level_19_count_positive_integers", ceil_fraction(F(57, 10) * 2) - 1, 11)
example("deep_9_maximum_strict_integer", ceil_fraction(F(69, 7) * 9) - 1, 88)
example("deep_10_second_ground_contact_distance", 180 + 2 * 180 * F(4, 5), 468)
example("deep_12_production_time", F(140, 10) * F(24, 7), 48)
mixed_values = [F(i) + F(n, d) for i, n, d in permutations([3, 4, 7]) if n < d]
example("deep_13_extreme_mixed_products", max(mixed_values) * min(mixed_values), F(775, 28))
example("deep_14_remaining_of_remaining", 60 * (1 - F(4, 5)) ** 2, F(12, 5))
example("deep_15_area", F(28, 5) * (F(28, 5) * F(10, 7)), F(224, 5))
example("deep_16_recover_whole", F(20) / ((1 - F(5, 7)) * F(1, 4)), 280)
example("deep_18_strip_area", F(25, 7) ** 2 * 490, 6250)
example("ice_18_smallest_strict_integer", math.floor(F(10, 3) * F(21, 10)) + 1, 8)
example("ice_21_recover_wrong_operation", (F(13, 6) + F(4, 3)) * F(4, 3), F(14, 3))

counts = {}

# Exhaustive finite-domain comparisons with explicit enumeration as the oracle.
count = 0
for denominator in range(1, 13):
    for numerator in range(1, 121):
        q = F(numerator, denominator)
        valid = [n for n in range(1, 122) if F(n) < q]
        assert max(0, ceil_fraction(q) - 1) == len(valid)
        assert math.floor(q) + 1 == next(n for n in range(1, 122) if F(n) > q)
        count += 1
counts["strict_integer_bounds"] = count

count = 0
for total_tenths in range(0, 501):
    value = F(total_tenths, 10)
    for step in [F(1, 10), F(1), F(10)]:
        floor_value = (value // step) * step
        ceil_value = ceil_fraction(value / step) * step
        round_value = rounded_nonnegative(value, step)
        assert floor_value <= value < floor_value + step
        assert ceil_value - step < value <= ceil_value
        assert abs(round_value - value) <= step / 2
        # At a tie the upper adjacent nonnegative multiple is selected.
        assert round_value == min([floor_value, ceil_value], key=lambda n: (abs(n - value), -n))
        count += 1
counts["rounding_boundaries"] = count

rng = random.Random(20260910)
for trial in range(5000):
    d1, d2 = rng.randint(2, 20), rng.randint(2, 20)
    n1, n2 = rng.randint(1, d1 - 1), rng.randint(1, d2 - 1)
    num, den = n1 * n2, d1 * d2
    g = math.gcd(num, den)
    cn, cd = num // g, den // g
    assert F(cn, cd) == F(n1, d1) * F(n2, d2)
    assert math.gcd(cn, cd) == 1 and 0 < cn < cd

    # Integer totals chosen so both allocations describe whole objects.
    total = d1 * d2 * rng.randint(1, 10)
    remaining1 = F(total) * (1 - F(n1, d1))
    remaining2 = remaining1 * (1 - F(n2, d2))
    assert remaining1.denominator == remaining2.denominator == 1
    used1 = total - remaining1
    used2 = remaining1 - remaining2
    assert used1 + used2 + remaining2 == total
    assert F(total) - used1 - used2 == remaining2
counts["fraction_products_and_nested_wholes"] = 5000

report = {
    "scope": "Exact rational research checks only. No PDF answer key, ChatGPT run, HTML game, or physical touchscreen was tested.",
    "examples": checks,
    "invariant_cases": counts,
    "status": "passed",
}
output = Path("docs/worksheet-math-checks.json")
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"examples": len(checks), "invariant_cases": counts, "status": "passed"}))
