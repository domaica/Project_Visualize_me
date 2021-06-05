#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
import json


# In[ ]:
def load_data():

    fast_food = pd.read_csv("restaurants.csv")
    fast_food.head()


    # In[ ]:


    fast_food = fast_food[["address", "latitude", "longitude", "name", "province"]]
    fast_food


    # In[ ]:


    fast_food = fast_food.rename(columns={"province": "state"})
    fast_food


    # In[ ]:


    fast_food.isnull().sum()


    # In[ ]:


    fast_food.dtypes


    # In[ ]:


    fast_food_dict = fast_food.to_dict("index")
    return fast_food_dict


    # In[ ]:




