import os 
import json

INPUT_PATH = "./data/processed/step_2_output.json"
OUTPUT_PATH = "./src/data.js"

if not os.path.exists(INPUT_PATH):
    raise Exception("could not find input file {}".format(INPUT_PATH))

if not os.path.exists(os.path.dirname(OUTPUT_PATH)):
    os.makedirs(os.path.dirname(OUTPUT_PATH)) 

with open(INPUT_PATH, "r") as f:
    input_data = json.load(f)

with open(OUTPUT_PATH, "w+") as f:
    f.write("export const data = ")
    f.write(json.dumps(input_data, indent=2))
    f.write(";")