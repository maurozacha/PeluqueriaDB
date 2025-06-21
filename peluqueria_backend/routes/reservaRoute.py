import datetime
from flask import jsonify, request
from app import app, db
from peluqueria_backend.models.reserva import Appointment

@app.route('/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([{
        'id': app.id,
        'date': app.date,
        'service_type': app.service_type
    } for app in appointments])

@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    new_appointment = Appointment(
        date=datetime.strptime(data['date'], '%Y-%m-%d %H:%M:%S'),
        service_type=data['service_type'],
        notes=data.get('notes', '')
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Turno creado exitosamente'}), 201