# extensions.py

from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

# Initialize extensions
mongo = PyMongo()
bcrypt = Bcrypt()
