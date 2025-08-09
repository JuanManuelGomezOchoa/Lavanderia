from flask import jsonify, request, Blueprint
from app.controllers.garment_controller import create_garment, update_garment, get_garment, get_garments
garment_bp = Blueprint("garment_bp", __name__, url_prefix="/garments")

@garment_bp.route("/create", methods=["POST"])
def create():
    data = request.json
    garment = create_garment(data["name"], data["description"], data["observations"])
    return jsonify({"msg":"Prenda Creada con exito", "garment_id":garment.id}),200

@garment_bp.route("/get-all", methods=["GET"])
def get_all():
    garments = get_garments()
    return jsonify({"msg":"Listado de prendas se ejecuto con exito", "garments":garments}),200