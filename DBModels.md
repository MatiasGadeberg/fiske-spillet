# Games
id -> unique
current_number_of_teams -> number
game_state -> ('not-started', 'active', 'ended')
start_time -> date
end_time -> date

# FishType
id -> unique
name -> string
min_price -> number
max_price -> number
current_price -> number
price_growth -> string ('positive', 'negative', 'neutral')
supply -> number

# BoatType
id -> unique
name -> sting
price -> number
cargo -> number
speed -> number

# BoatTypeAvailableFish
// What type of fish can a given boat type catch
boat_type_id -> foreign_key(boat_type_id + fish_id)
fish_id -> foreign_key(boat_type_id + fish_id)

# Teams
id -> unique
name -> sting
game_id -> foreign_key(games table)
active_logins -> number
points -> number
login -> string
password -> string
category -> string ('væbner', 'senior')

# Boats
id -> unique
team_id -> foreign_key(teams table)
boat_type_id -> foreign_key(boat types table)
name -> string
inUse -> boolean
startTime -> date
endTime -> date
catchTime -> date
desitnation -> foreign_key (areas table)
status -> string ('outbound', 'inbound', 'docked')

# BoatCargo
boat_id -> foreign_key(composite key boat_id + fish_id)
fish_id -> foreign_key(composite key boat_id + fish_id)
amount -> number


# TeamFish
team_id -> foreign_key (composite key team_id + fish_id)
fish_id -> foreign_key (composite key team_id + fish_id)
amount -> number

# FishingAreas
id -> unique
color -> number

# FishingAreaStocks
area_id -> foreign_key (composite key area_id + fish_id)
fish_id -> foreign_key (composite key area_id + fish_id)
max_amount -> number
current_amount -> number

