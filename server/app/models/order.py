from app.database.db import db
from datetime import datetime

class Order(db.Model):
    __tablename__="orders"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    estimated_delivery_date = db.Column(db.DateTime, nullable=False)
    real_delivery_date = db.Column(db.DateTime)
    state = db.Column(db.String(20), default="recibido")#recibido, en proceso, listo, entregado
    total = db.Column(db.Integer, nullable=False)
    pagado = db.Column(db.Boolean, default=False)
    #Relaciones inversas pendientes 

    garments = db.relationship("Garment", backref = "order", lazy = True)
    #Relacion de pago

    def to_dict(self, garments:bool = False):
        """ order = {
            'id':self.id,
            'client_id':self.client_id,
            'user_id':self.user_id,
            'created_at':self.created_at, 
            'estimated_delivery_date':self.estimated_delivery_date, 
            'state':self.state, 
            'total':self.total, 
            'pagado':self.pagado, 
        }
        if garments:
            order["garments"] = self.garments
        return order """
        return self.__dict__