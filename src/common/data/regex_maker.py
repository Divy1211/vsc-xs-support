import json
with open("./constants.json") as file:
    consts = json.load(file)

regexp = "(true|false|"

for const in consts:
    regexp = regexp+f"{const}|"

regexp = regexp[:-1]+")"

print(regexp)