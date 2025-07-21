from pymongo import MongoClient
from bson.objectid import ObjectId
import os

MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["fyp_db"]
users_collection = db["users"]
