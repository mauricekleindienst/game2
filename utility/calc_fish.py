import pandas as pd
import math

def calculate_min_catch_time(level):
    return math.floor(3 + (level / 20) + 0.5)


def calculate_max_catch_time(level):
    return math.floor(6 + (level / 9) + 0.5)


def calculate_xp(level):
    xp_value = 5 + 5 * math.floor((level * 2 + (level**2 / 15)) / 5 + 0.5)
    return xp_value


def create_table(max_level):
    data = []

    for level in range(0, max_level + 1, 10):
        min_catch_time = calculate_min_catch_time(level)
        max_catch_time = calculate_max_catch_time(level)
        xp = calculate_xp(level)
        
        data.append([level, min_catch_time, max_catch_time, xp])

    df = pd.DataFrame(data, columns=["Level", "Min Catch Time", "Max Catch Time", "XP"])
    
    return df

max_level = 100
table = create_table(max_level)

print(table)


table.to_csv("utility/catch_times_and_xp.csv", index=False)
