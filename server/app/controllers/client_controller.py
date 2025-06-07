from app.models.client import Client
from app import db

def create_client(name, phone_number, address):
    new_client = Client(name = name, phone_number = phone_number, address = address)
    db.session.add(new_client)
    db.session.commit()
    return new_client

def search_client_by_name(name):
    return Client.query.filter(Client.name.ilike(f"%{name}%")).all()


def search_client_by_phone(phone):
    return Client.query.filter_by(phone_number = phone).first()

def update_client(client_id, updated_data):
    client = Client.query.get(client_id)
    if not client:
        return None
    
    for key, value in updated_data.items():
        setattr(client, key, value)
    db.session.commit()
    return client

def delete_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return None
    
    db.session.delete(client)
    db.session.commit()
    return client