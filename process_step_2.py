import os
import json

INPUT_PATH = "./processed/step_1_output.json"
OUTPUT_PATH = "./processed/step_2_output.json"

with open(INPUT_PATH, 'r') as f:
  input_data = json.load(f)

aminos = input_data["aminos"]
foods = input_data["foods"]

# In the legacy dataset, brands are capitalized
#brands = [x["name"] for x in filter(lambda x: x["name"][:2] == x["name"][:2].upper(), foods)]
foods = [food for food in filter(lambda x: not x["name"][:2] == x["name"][:2].upper(), foods)]

out = {
    "foods": {food["id"]: food for food in foods},
    "aminos": aminos,
    "orderedAminos": [k for k in aminos.keys()]
}

with open(OUTPUT_PATH, "w+") as f:
    f.write(json.dumps(out, indent=2)) 

