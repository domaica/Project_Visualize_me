from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import fast_food

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/fastfood")


# import os

# cwd = os.getcwd()  # Get the current working directory (cwd)
# files = os.listdir(cwd)  # Get all the files in that directory
# print("Files in %r: %s" % (cwd, files))

# Get the data to load to MongoDB
data = fast_food.load_data()
#print(data)

# Update the Mongo database using update and upsert=True
#mongo.db.collection.update({}, data, upsert=True)

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find the fast food data from the mongo database
    ff_data = mongo.db.collection.find()

    # Return template and data
    return render_template("index.html", fast_food_data=ff_data)

# Route that will display the JSON
@app.route("/json") #variables in the route to get the specific data
def json():

    #add python POST
    
    # Display the data the JSON info
    
    # Find the fast food data from the mongo database
    ff_data = list(mongo.db.collection.find())

    # Return the JSON data
    return dumps(ff_data)

if __name__ == "__main__":
    app.run(debug=True)
