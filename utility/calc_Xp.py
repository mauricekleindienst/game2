import json

total_xp = 0
difference = 0
data = {}

levels = 99

file = "utility/xp_data.json"

def xp_formel(level):
   return round((1/8) * (level**2 - level + 600 * ((2**(level/7) - 2**(1/7)) / (2**(1/7) - 1))))

for level in range(1,levels +1):
    xp_required  =xp_formel(level)
    print(xp_required)    
    difference = xp_required - total_xp
    total_xp = xp_required

    data[level] = {
        "total_xp": total_xp,
        "difference": difference
    }
    
    
with open(file,"w") as f:
    json.dump(data,f,indent=4)



