#Workshop 2

So for my implementation, I started out in the server file, and created the csvHandler. In the handler 
I read the entire file to a variable called data. Then I split the data by each new line. Each cell in the array that came out of the split 
was turned into an object with the property names being the csv field names, and the properties being the corresponding user data. Each time a 
object was created in the loop, it was added to an overall user object array. Once the array was complete, it was turned into a JSON array and 
sent to the client. 

When it went to the client, the csvHandler for the client parsed the given JSON data back into an array of user objects. I then looped 
through the array and printed out the information of each object in a user friendly format. The handler to return another csv (as opposed to
user friendly UI) worked similarly. It parsed the JSON back into an array of user objects. Then it looped through, and on each user, it created
a string that emulated the look of a csv line, and then printed it. 

I tried my best to make the implementation work in a way that would be applicable to multiple csv files. That way if some other type of csv,
some other type of data perhaps and with similar header formatting, was given in the request, then the program could do the exact same with that
csv. The only issue I ran into was with the readFile function. I tried to grab the url in a similar fashion to the json handler in the server file and then use it as part of the path for readFile. However, everytime I tried, it would not work, so I ended up having to hardcode the path in. That's the one aspect of this that I was not able to universal.
