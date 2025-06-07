from app.database.db import db

class Log(db.Model):
    __tablename__ = "logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    action = db.Column(db.String(50))
    date = db.Column(db.DateTime)

    def to_dict(self):
            logs = {
               'id': self.id,
               'user_id': self.user_id,
               'actions': self.action,
               'date': self.date
            } 
            return logs