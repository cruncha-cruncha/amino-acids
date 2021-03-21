import csv
import os
import json
from difflib import SequenceMatcher

ESSENTIAL_AMINO_ACIDS = [
    'Histidine',
    'Isoleucine',
    'Leucine',
    'Lysine',
    'Methionine',
    'Cystine',
    'Phenylalanine',
    'Tyrosine',
    'Threonine',
    'Tryptophan',
    'Valine'
]

FOOD_PATH = "./raw/core/food.csv"
FOOD_NUTRIENT_PATH = "./raw/core/food_nutrient.csv"
NUTRIENT_PATH = "./raw/supporting/nutrient.csv"
OUTPUT_PATH = "./processed/step_1_output.json"

class nutrientLookup:
    _initialized = False
    _nutrientLookupById = {}
    _nutrientLookupByName = {}

    @classmethod
    def _init(cls):
        if (cls._initialized):
            return
        with open(NUTRIENT_PATH, 'r') as f:
            csv_reader = csv.reader(f, delimiter=',')
            columns = next(csv_reader)
            if (not columns[0] == 'id') or (not columns[1] == 'name') or (not columns[2] == 'unit_name'):
                raise Exception("bad " + NUTRIENT_PATH + ", " + str(columns)) 
            for row in csv_reader:
                cls._nutrientLookupById[row[0]] = { "name": row[1], "unit_name": row[2] }
                cls._nutrientLookupByName[row[1]] = { "id": row[0], "unit_name": row[2] }
        cls._initialized = True
    
    @classmethod
    def byId(cls, id):
        cls._init()
        if id in cls._nutrientLookupById:
            return cls._nutrientLookupById[id]
        else:
            return { "name": '', "unit_name": '' }

    @classmethod
    def byName(cls, name):
        cls._init()
        if name in cls._nutrientLookupByName:
            return cls._nutrientLookupByName[name]
        else:
            return { "id": '', "unit_name": '' }

    @classmethod
    def len(cls):
        cls._init()
        return len(cls._nutrientLookupById)

class foodLookup:
    _initialized = False
    _foodLookup = {}

    @classmethod
    def _init(cls):
        if (cls._initialized):
            return
        with open(FOOD_PATH, 'r') as f:
            csv_reader = csv.reader(f, delimiter=',')
            columns = next(csv_reader)
            if (not columns[0] == 'fdc_id') or (not columns[2] == 'description'):
                raise Exception("bad " + FOOD_PATH + ", " + str(columns)) 
            for row in csv_reader:
                cls._foodLookup[row[0]] = { "name": row[2] }
        cls._initialized = True
    
    @classmethod
    def byId(cls, id):
        cls._init()
        if id in cls._foodLookup:
            return cls._foodLookup[id]
        else:
            return ''
    
    @classmethod
    def len(cls):
        cls._init()
        return len(cls._foodLookup)

def verifyAminoUnits():
    for a in ESSENTIAL_AMINO_ACIDS:
        unit = nutrientLookup.byName(a)["unit_name"]
        if not unit == 'G':
            raise Exception("amino acid {} is not measured in grams, but {}".format(a, unit))

def foodsHavingAminos(amino_ids):
    aminoTracker = {aid: [] for aid in amino_ids}
    joins = []

    with open(FOOD_NUTRIENT_PATH, 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        columns = next(csv_reader)
        if (not columns[1] == 'fdc_id') or (not columns[2] == 'nutrient_id') or (not columns[3] == 'amount'):
            raise Exception("bad " + FOOD_NUTRIENT_PATH + ", " + str(columns)) 
        for row in csv_reader:
            if row[2] in amino_ids:
                aminoTracker[row[2]].append(row[1]) 
                joins.append({ "fdc_id": row[1], "nutrient_id": row[2], "amount": row[3] })
    
    foods = set(aminoTracker[amino_ids[0]])
    for v in aminoTracker.values():
        foods = foods | set(v)

    return foods, joins

class FoodNutrientLookup:
    _joins = []
    _foodNutrientLookup = {}

    def __init__(self, joins):
        self._joins = joins
    
    def byFoodId(self, id):
        if id in self._foodNutrientLookup:
            return self._foodNutrientLookup[id]
        else:
            nutrients = list(filter(lambda j: (j['fdc_id'] == id), self._joins))
            self._foodNutrientLookup[id] = nutrients
            return nutrients

class GoodFood:
    def __init__(self, food_id, amino_ids, foodNutrientLookup):
        self.id = food_id
        self.name = foodLookup.byId(food_id)["name"]

        self.aminoAmounts = {}
        nutrients = foodNutrientLookup.byFoodId(food_id)
        for aid in amino_ids:
            single_nutrient = list(filter(lambda n: n["nutrient_id"] == aid, nutrients))
            if len(single_nutrient) < 1:
                self.aminoAmounts[aid] = float(0)
                continue
            self.aminoAmounts[aid] = float(single_nutrient[0]["amount"])

    def __str__(self):
        return "{} {}".format(self.id, self.name)

def saveData(good_food_ids, amino_ids, foodNutrientLookup):
    amino_lookup = {aid: nutrientLookup.byId(aid)["name"] for aid in amino_ids}
    good_foods = []
    for fid in good_food_ids:
        good_foods.append(GoodFood(fid, amino_ids, foodNutrientLookup).__dict__)
        print(".", end='', flush=True)
    print()
    
    if not os.path.exists(os.path.dirname(OUTPUT_PATH)):
        os.makedirs(os.path.dirname(OUTPUT_PATH))
    with open(OUTPUT_PATH, "w+") as f:
        f.write(json.dumps({ "foods": good_foods, "aminos": amino_lookup }, indent=2))


verifyAminoUnits()

amino_ids = [nutrientLookup.byName(a)['id'] for a in ESSENTIAL_AMINO_ACIDS]

good_food_ids, food_nutrient_joins = foodsHavingAminos(amino_ids)

foodNutrientLookup = FoodNutrientLookup(food_nutrient_joins)

saveData(good_food_ids, amino_ids, foodNutrientLookup)

