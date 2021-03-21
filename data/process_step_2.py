import os
import json

INPUT_PATH = "./processed/step_1_output.json"
OUTPUT_PATH = "./processed/step_2_output.json"

with open(INPUT_PATH, 'r') as f:
  input_data = json.load(f)

aminos = input_data["aminos"]
foods = input_data["foods"]

# Filter out brand names. In the legacy dataset, brands are capitalized
#brands = [x["name"] for x in filter(lambda x: x["name"][:2] == x["name"][:2].upper(), foods)]
foods = [food for food in filter(lambda x: not x["name"][:2] == x["name"][:2].upper(), foods)]

# Ensure all names are unique
food_names = set([food["name"] for food in foods])
if not len(foods) == len(food_names):
  raise Exception("duplicate food name") 


# combine methionine + cystine and phenylalanine + tyrosine
reverse_amino_lookup = {v: k for k, v in aminos.items()}

methionine_id = reverse_amino_lookup["Methionine"]
cystine_id = reverse_amino_lookup["Cystine"]
phenylalanine_id = reverse_amino_lookup["Phenylalanine"]
tyrosine_id = reverse_amino_lookup["Tyrosine"]

for food in foods:
  food["aminoAmounts"][methionine_id] = round(food["aminoAmounts"][methionine_id] + food["aminoAmounts"][cystine_id], 3)
  del food["aminoAmounts"][cystine_id]
  food["aminoAmounts"][phenylalanine_id] = round(food["aminoAmounts"][phenylalanine_id] + food["aminoAmounts"][tyrosine_id], 3)
  del food["aminoAmounts"][tyrosine_id]

del aminos[cystine_id]
del aminos[tyrosine_id]

# create output dict
out = {
    "foods": {food["id"]: food for food in foods},
    "aminos": aminos,
    "orderedAminos": [k for k in aminos.keys()]
}

# save
with open(OUTPUT_PATH, "w+") as f:
    f.write(json.dumps(out, indent=2)) 

