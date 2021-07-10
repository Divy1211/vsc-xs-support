import json
with open("C:/Users/LENOVO PC/My Stuff/web dev/VSCE/aoe2xsscripting/src/data/constants.json") as file:
    consts = json.load(file)

regexp = "(true|false|"

for const in consts:
    regexp = regexp+f"{const}|"

regexp = regexp[:-1]+")"

print(regexp)