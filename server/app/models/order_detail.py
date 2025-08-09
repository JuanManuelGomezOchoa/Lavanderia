from app.database.db import db

class OrderDetail(db.Model):
    __tablename__ = "order_detail"

    id = db.Column(db.Integer, primary_key = True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    garment_id = db.Column(db.Integer, db.ForeignKey("garments.id"), nullable = False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable = False)
    quantity = db.Column(db.Integer, nullable = False)


    def to_dict(self):
        """ order_detail = {
            'id':self.id,
            'garment_id':self.garment_id,
            'service_id':self.service_id,
            'quantity':self.quantity, 
        }
        return order_detail """
        return self.__dict__
