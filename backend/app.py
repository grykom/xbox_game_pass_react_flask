from flask import Flask, jsonify, request
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app)


@app.route("/api/games/list/<language>")
def get_games(language):
    market = language.split("-")[1].upper()
    url = f"https://catalog.gamepass.com/sigls/v2?id=f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e&market={market}"
    try:
        games_response = requests.get(url).json()
        return jsonify(games_response)
    except:
        return jsonify("API error while downloading list of games"), 400


@app.route("/api/games/info/<language>", methods=["POST"])
def get_info(language):
    language = language.upper()
    market = language.split("-")[1]
    payload = {"Products": request.json}
    url = f"https://catalog.gamepass.com/products?market={market}&language={language}&hydration=MobileDetailsForConsole"
    try:
        all_games_response = requests.post(url, json=payload).json()
    except:
        return jsonify("API error while downloading games data"), 400

    try:
        all_games_array = []
        for game in all_games_response["Products"]:
            game_dict = {
                "game_id": game,
                "game_name": all_games_response["Products"][game]["ProductTitle"],
                "developer": all_games_response["Products"][game]["DeveloperName"],
                "publisher": all_games_response["Products"][game]["PublisherName"],
                "description": all_games_response["Products"][game][
                    "ProductDescription"
                ],
                "game_cover": all_games_response["Products"][game]["ImageTile"]["URI"],
                "rating_system": all_games_response["Products"][game]["ContentRating"][
                    "RatingSystem"
                ],
                "rating_image": all_games_response["Products"][game]["ContentRating"][
                    "RatingValueLogoUrl"
                ],
                "categories": all_games_response["Products"][game]["Categories"],
            }
            all_games_array.append(game_dict)
        return jsonify(all_games_array)
    except KeyError:
        return "Api data error", 400
