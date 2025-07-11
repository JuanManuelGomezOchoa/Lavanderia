from flask import jsonify, request ,Blueprint
from app.controllers.order_controller import create_order, get_all_garments, delete_garment, update_garment, add_garment, create_order_detail, delete_service, add_service, get_order_detail, get_all_services, update_service
import datetime

order_bp = Blueprint("order_bp", __name__, url_prefix="/orders")

@order_bp.route("/create", methods=["POST"])
def create():
    data = request.json
    splited_date = data["estimated_delivery_date"].split("-")
    date = datetime.date(int(splited_date[0]), int(splited_date[1]), int(splited_date[2])) 
    
    order = create_order(
        client_id = data["client_id"],
        user_id = data["user_id"],
        estimated_date = date,
        total_price = data["total"]
        )
    for garment in data["garments"]:
        new_garment = add_garment(
            order_id = order.id,
            type = garment["type"],
            description = garment["description"],
            notes = garment["observations"]
        )
        for service in garment["services"]:
            new_service = add_service(name = service["name"], description = "Descripcion momentanea", price = service["unitPrice"])
            subtotal = service["unitPrice"] * service["quantity"]
            create_order_detail(garment_id=new_garment.id, service_id=new_service.id, quantity=service["quantity"])
    return jsonify({"msg":"Orden creada con exito", "order_id":order.id}),200        

@order_bp.route("/get-order-detail/<int:order_id>", methods=["GET"])
def get_order_detail_endpoint(order_id):
    try:
        order = get_order_detail(order_id)
        return jsonify ({"msg":"Detalle de orden obtenido", "order":order}),200
    except Exception as e:
        return jsonify ({"msg":"Ocurrio un error", "error":e}),500

@order_bp.route("/services", methods=["GET"])
def get_services():
    try:
        services = get_all_services()
        return jsonify({"msg": "Servicios obtenidos con éxito", "services": services}), 200
    except Exception as e:
        return jsonify({"msg": "Ocurrió un error al obtener los servicios", "error": str(e)}), 500
    
@order_bp.route("/services/<int:service_id>", methods=["DELETE"])
def delete_service_endpoint(service_id):
    result = delete_service(service_id)
    status_code = 200 if result["success"] else 400
    return jsonify(result), status_code

@order_bp.route("/services/<int:service_id>", methods=["PUT"])
def update_service_endpoint(service_id):
    data = request.get_json()
    result = update_service(service_id, data)
    return jsonify(result[0]), result[1]


# Ruta para eliminar prenda
@order_bp.route("/garments/<int:garment_id>", methods=["DELETE"])
def delete_garment_endpoint(garment_id):
    result = delete_garment(garment_id)
    status_code = 200 if result["success"] else 400
    return jsonify(result), status_code

# Ruta para actualizar prenda
@order_bp.route("/garments/<int:garment_id>", methods=["PUT"])
def update_garment_endpoint(garment_id):
    data = request.get_json()
    result = update_garment(garment_id, data)
    return jsonify(result[0]), result[1]

# Obtener todas las prendas 
@order_bp.route("/garments", methods=["GET"])
def get_garments_endpoint():
    garments = get_all_garments()
    return jsonify({"garments": garments})

