import turtle
import random

# ---------------- SCREEN ----------------
screen = turtle.Screen()
screen.setup(800, 600)
screen.bgcolor("skyblue")
screen.tracer(0)

# ---------------- NAME INPUT (TRINKET SAFE) ----------------
try:
    name = input("What should your turtle be called? ")
except:
    name = "Ham"

if name == "":
    name = "Ham"
# ---------------- HATCH INTRO ----------------

import time

pet = turtle.Turtle()
pet.penup()
pet.speed(0)

# Egg
pet.shape("circle")
pet.color("white")

screen.update()
time.sleep(2)

# Wiggle
for i in range(10):
    pet.left(20)
    screen.update()
    time.sleep(0.1)

    pet.right(40)
    screen.update()
    time.sleep(0.1)

    pet.left(20)
    screen.update()
    time.sleep(0.1)

time.sleep(1)

# Hatch
pet.shape("turtle")
pet.color("green")

screen.update()
time.sleep(1)

# ---------------- END HATCH ----------------
# ---------------- SPEECH ----------------
speech = turtle.Turtle()
speech.hideturtle()
speech.penup()

def say(text):
    speech.clear()
    speech.goto(pet.xcor(), pet.ycor() + 30)
    speech.write(text, align="center")

# ---------------- FOOD ----------------
food = turtle.Turtle()
food.shape("circle")
food.color("red")
food.penup()
food.hideturtle()

food_exists = False

def place_food(x, y):
    global food_exists
    food.goto(x, y)
    food.showturtle()
    food_exists = True

screen.onclick(place_food)

# ---------------- TOY ----------------
toy = turtle.Turtle()
toy.shape("circle")
toy.color("blue")
toy.penup()
toy.hideturtle()

toy_exists = False

def spawn_toy():
    global toy_exists
    toy.goto(random.randint(-300, 300), random.randint(-200, 200))
    toy.showturtle()
    toy_exists = True

screen.listen()
screen.onkey(spawn_toy, "t")

# ---------------- BED ----------------
bed = turtle.Turtle()
bed.shape("square")
bed.color("brown")
bed.penup()
bed.goto(-350, -250)

# ---------------- STATUS ----------------
status = turtle.Turtle()
status.hideturtle()
status.penup()
status.goto(-390, 260)

# ---------------- STATS ----------------

hunger = 0
sleepiness = 0
happiness = 100
health = 100

personality = random.choice([
    "lazy",
    "energetic",
    "hungry",
    "chaotic"
])

weather = "Sunny"
weather_timer = 0

level = 1
xp = 0
stage = "Baby"

zoomies = 0
sleeping = False

day = True
timer = 0

# ---------------- GAME LOOP ----------------

while True:

    timer += 1
    weather_timer += 1

    # WEATHER
    if weather_timer > 3000:

        weather_timer = 0

        weather = random.choice([
            "Sunny",
            "Rainy",
            "Stormy",
            "Snowy"
        ])

        say("Weather: " + weather)

    # DAY / NIGHT
    if timer > 5000:

        day = not day
        timer = 0

        if day:
            screen.bgcolor("skyblue")
            say(name + " says: Good morning!")
        else:
            screen.bgcolor("midnightblue")
            say(name + " says: Good night!")

    # STATS UPDATE
    if timer % 50 == 0:

        hunger += 1

        if day:
            sleepiness += 1
        else:
            sleepiness += 2

        # WEATHER EFFECTS
        if weather == "Sunny":
            happiness += 1

        elif weather == "Stormy":
            happiness -= 1

        # PERSONALITY EFFECTS
        if personality == "hungry":
            hunger += 1

        elif personality == "lazy":
            sleepiness += 1

        elif personality == "energetic":
            happiness += 1

        elif personality == "chaotic":
            if random.randint(1, 20) == 1:
                pet.left(180)

        # HEALTH
        if hunger > 90:
            health -= 1

        if hunger > 50:
            happiness -= 1

        health = max(0, health)

        hunger = min(hunger, 100)
        sleepiness = min(sleepiness, 100)
        happiness = max(0, min(happiness, 100))

    # LEVEL UP
    if xp >= level * 25:

      xp = 0
      level += 1

      say(name + " reached level " + str(level) + "!")

    if level == 10:
        say(name + " became a Young Turtle!")

    elif level == 25:
        say(name + " became an Adult Turtle!")

    elif level == 50:
        say(name + " became a Giant Turtle!")

    elif level == 100:
        say(name + " became a Turtle Overlord!")
    if level >= 100:

      stage = "Overlord"
      pet.color("purple")

    elif level >= 50:

      stage = "Giant"
      pet.color("red")

    elif level >= 25:

      stage = "Adult"
      pet.color("orange")

    elif level >= 10:

      stage = "Young"
      pet.color("gold")

    else: 

      stage = "Baby"
      pet.color("green")
    # SPEECH
    if hunger > 80:
        say(name + " is hungry...")

    elif sleepiness > 80 and not sleeping:
        say(name + " is sleepy...")

    elif happiness > 90:
        say(name + " is happy!")

    # ZOOMIES
    if (not sleeping) and happiness > 90:

        if random.randint(1, 500) == 1:

            zoomies = 150
            say(name + " goes WHEEEE!")

    # SLEEPING
    if sleeping:

        pet.goto(bed.xcor(), bed.ycor())

        sleepiness -= 1

        if sleepiness <= 20:

            sleeping = False
            say(name + " woke up!")

    elif sleepiness > 80:

        pet.setheading(pet.towards(bed))
        pet.forward(2)

        if pet.distance(bed) < 20:

            sleeping = True
            say(name + " is sleeping...")

    # FOOD
    elif food_exists:

        pet.setheading(pet.towards(food))
        pet.forward(3)

        if pet.distance(food) < 15:

            food.hideturtle()
            food_exists = False

            hunger -= 40
            happiness += 10
            xp += 5
            health += 5

            hunger = max(0, hunger)
            health = min(100, health)
            happiness = min(100, happiness)

            say(name + " says: nom nom!")

    # TOY
    elif toy_exists:

        pet.setheading(pet.towards(toy))
        pet.forward(3)

        if pet.distance(toy) < 15:

            toy.hideturtle()
            toy_exists = False

            happiness += 20
            xp += 10

            happiness = min(100, happiness)

            say(name + " plays happily!")

    # ZOOMIES
    elif zoomies > 0:

        pet.forward(8)

        if random.randint(1, 5) == 1:
            pet.left(random.randint(-180, 180))

        zoomies -= 1

    # WANDER
    else:

        pet.forward(1)

        if random.randint(1, 50) == 1:
            pet.left(random.randint(-90, 90))

    # WALLS
    x = pet.xcor()
    y = pet.ycor()

    if x > 380 or x < -380:
        pet.setheading(180 - pet.heading())

    if y > 280 or y < -280:
        pet.setheading(-pet.heading())

    # STATUS
    status.clear()

    status.write(
        name +
        name +
" | {} | Lv:{} XP:{} HP:{} H:{} S:{} Happy:{} | {} | {}".format(
            stage,
            level,
            xp,
            health,
            hunger,
            sleepiness,
            happiness,
            personality,
            weather
        ),
        font=("Arial", 12, "normal")
    )

    screen.update()
      
