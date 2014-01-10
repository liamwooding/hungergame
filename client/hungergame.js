Template.addPerson.events = {
  "submit": function(event, template) {
    event.preventDefault()
    var person = {
      name: template.find("#name").value,
      photo: template.find("#photo").value
    }

    template.find("#name").value = ""
    template.find("#photo").value = ""    
    
    People.insert(person)

    console.log(People.find().count())
  }
}

Template.people.events = {
  "click .person": function(event, template) {
    event.preventDefault()
    console.log(arguments, this)

    var lunch = Lunches.findOne({date: todaysDate()})

    if (lunch.eaters.some( function(eaterId) { return eaterId == this.id }) ) {
      Lunches.update(lunch._id, {$pull: {eaters: this.id}}, function(er, data) { console.log("pull", er) })
      console.log(Lunches.findOne(lunch._id))
    } else {
      Lunches.update(lunch._id, {$push: {eaters: this.id}}, function(er, data) { console.log("push", er) })
      console.log(Lunches.findOne(lunch._id))
    }
  }
}

Template.people.all = function() {
  return People.find()
}

Template.people.selected = function(person) {
  var lunch = Lunches.findOne({date: todaysDate()})
  console.log("selecting", lunch)
  if (lunch == null) {
    var id = Lunches.insert({date: todaysDate(), eaters: []})
    return false
  }

  return lunch.eaters.some(function(eaterId) {
    return eaterId == person._id
  })
}

todaysDate = function todaysDate () {
  var isoString = new Date().toISOString()
  var todaysDate = isoString.split("T")[0]
  return todaysDate
}

Template.people.cooking = function () {
  return true
}