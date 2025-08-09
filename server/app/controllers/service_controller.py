from app import db
from app.models.service import Service

def create_service(name, description, price):
    new_service = Service(name = name, description = description, price = price)
    db.session.add(new_service)
    db.session.commit()
    return new_service


def update_service(service_id, updated_data):
    service = Service.query.get(service_id)
    if not service:
        return None
    
    for key, value in updated_data.items():
        setattr(service, key, value)
    db.session.commit()
    return service

def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return None
    
    db.session.delete(service)
    db.session.commit()
    return service

def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return None
    return service

def get_services():
    services = Service.query.filter().all()
    if not services:
        return None
    return [service.to_dict() for service in services]