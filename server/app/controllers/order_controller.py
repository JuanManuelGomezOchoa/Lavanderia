from app.database.db import db
from app.models.order import Order
from app.models.garment import Garment
from app.models.order_detail import OrderDetail
from app.models.service import Service

def create_order(client_id, user_id, estimated_date, total_price):
    print(total_price, "HOLA SOY TOTAL PRICE")
    order = Order(client_id= client_id, user_id= user_id, estimated_delivery_date= estimated_date, total=total_price)
    db.session.add(order)
    db.session.commit()
    return order

def add_service(name, description, price):
    service = Service(name = name, description=description, price = price)
    db.session.add(service)
    db.session.commit()
    return service

def add_garment(order_id, type, description, notes):
    garment = Garment(order_id=order_id, type = type, description=description, observations=notes)
    db.session.add(garment)
    db.session.commit()
    return garment

def create_order_detail(garment_id, service_id, quantity):
    order_detail = OrderDetail(garment_id=garment_id, service_id=service_id, quantity=quantity)
    db.session.add(order_detail)
    db.session.commit()
    return order_detail


def get_order_detail(order_id):
    #La busqueda debe de traer cliente, garment y cada uno debe de traer su propio servicio
    order= Order.query.get(order_id)

    print("HOLA SOY ORDEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER", order.to_dict())

    order_data={
        "order_id":order.id,
        "client":order.client.name,
        "status":order.state,
        "garments":[]
    } 

    garments = Garment.query.filter_by(order_id = order.id)
    print("HOLA SOY GARMENTS +++++++++++++++++++++++++++++++++++++++", garments)

    for garment in garments:
        print("HOLA AMIGO TIENES UNA MONEDAS? GARMENTTTTTTTTTTTTTTTTT" , garment.to_dict())
        garment_data = {
            "type":garment.type,
            "description":garment.description,
            "observations":garment.observations,
            "services":[]
        }
        for gs in garment.order_detail:
            print("SOY GGGGSSSSSS", gs.to_dict())
            service = Service.query.get(gs.service_id)
            print("HOLA AMIGO TIENES UNA MONEDAS? Services", service.to_dict())
            service_data= {
                "name":service.name,
                "description": service.description,
                "price":service.price
            }
            garment_data["services"].append(service_data)
        order_data["garments"].append(garment_data)
    return order_data

def update_order_status(order_id, new_status):
    order = Order.query.get(order_id)
    if not order:
        return None
    order.state =  new_status
    db.session.commit()
    return order

def list_orders_by_status(status):
    orders = Order.query.filter_by(state=status).all()
    data = [{
        "id":order.id,
        "client_id":order.client_id,
        "state":order.state,
        "estimated_delivery_date":order.estimated_delivery_date,
        "total":order.total,
        "pagado":order.pagado,
    } for order in orders]
    return data

def get_all_services():
    services = Service.query.all()
    return [{
        "id": service.id,
        "name": service.name,
        "description": service.description,
        "price": service.price
    } for service in services]

def delete_service(service_id):
    try:
        
        OrderDetail.query.filter_by(service_id=service_id).delete()

        service = Service.query.get(service_id)
        if service:
            db.session.delete(service)
            db.session.commit()
            return {"success": True, "message": "Servicio eliminado correctamente"}
        return {"success": False, "message": "Servicio no encontrado"}
    except Exception as e:
        db.session.rollback()
        return {"success": False, "message": f"Error al eliminar: {str(e)}"}
    
def update_service(service_id, new_data):
    try:
        service = Service.query.get(service_id)
        if not service:
            return {"success": False, "message": "Servicio no encontrado"}, 404
        
        service.name = new_data.get('name', service.name)
        service.description = new_data.get('description', service.description)
        service.price = new_data.get('price', service.price)
        
        db.session.commit()
        
        service_data = {
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "price": service.price
        }
        
        return {"success": True, "message": "Servicio actualizado", "service": service_data}, 200
    except Exception as e:
        db.session.rollback()
        return {"success": False, "message": f"Error al actualizar: {str(e)}"}, 500
    

# Funcion para eliminar una prenda
def delete_garment(garment_id):
    try:
        # Primero eliminar los order_detail relacionados
        OrderDetail.query.filter_by(garment_id=garment_id).delete()
        
        garment = Garment.query.get(garment_id)
        if garment:
            db.session.delete(garment)
            db.session.commit()
            return {"success": True, "message": "Prenda eliminada correctamente"}
        return {"success": False, "message": "Prenda no encontrada"}
    except Exception as e:
        db.session.rollback()
        return {"success": False, "message": f"Error al eliminar: {str(e)}"}

# Funcion para actualizar una prenda
def update_garment(garment_id, new_data):
    try:
        garment = Garment.query.get(garment_id)
        if not garment:
            return {"success": False, "message": "Prenda no encontrada"}, 404
        
        garment.type = new_data.get('type', garment.type)
        garment.description = new_data.get('description', garment.description)
        garment.observations = new_data.get('observations', garment.observations)
        
        db.session.commit()
        
        return {
            "success": True,
            "message": "Prenda actualizada",
            "garment": {
                "id": garment.id,
                "type": garment.type,
                "description": garment.description,
                "observations": garment.observations
            }
        }, 200
    except Exception as e:
        db.session.rollback()
        return {"success": False, "message": f"Error al actualizar: {str(e)}"}, 500
    

# Funcion para obtener todas las prendas
def get_all_garments():
    garments = Garment.query.all()
    return [{
        "id": garment.id,
        "type": garment.type,
        "description": garment.description,
        "observations": garment.observations,
        "order_id": garment.order_id
    } for garment in garments]

