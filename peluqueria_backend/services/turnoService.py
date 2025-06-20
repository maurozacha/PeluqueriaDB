from datetime import datetime, timedelta
from models import db, Turno, Empleado, Servicio, EstadoTurno

class TurnoService:
    @staticmethod
    def get_turnos(fecha_inicio=None, fecha_fin=None, estado=None):
        query = Turno.query
        
        if fecha_inicio:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
            query = query.filter(Turno.fecha_hora >= fecha_inicio)
        
        if fecha_fin:
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d')
            query = query.filter(Turno.fecha_hora <= fecha_fin)
        
        if estado:
            query = query.filter_by(estado=EstadoTurno[estado.upper()])
        
        return query.order_by(Turno.fecha_hora).all()
    
    @staticmethod
    def get_disponibilidad(servicio_id, fecha=None, empleado_id=None):
        servicio = Servicio.query.get_or_404(servicio_id)
        duracion = servicio.duracion if hasattr(servicio, 'duracion') else 30
        
        fecha_inicio = datetime.strptime(fecha, '%Y-%m-%d') if fecha else datetime.now()
        fecha_fin = fecha_inicio + timedelta(days=1)  
        
        query = Empleado.query.filter_by(activo=True)
        if empleado_id:
            query = query.filter_by(id=empleado_id)
        
        empleados = query.all()
        disponibilidad = []
        
        for empleado in empleados:
            turnos = Turno.query.filter(
                Turno.empleado_id == empleado.id,
                Turno.fecha_hora >= fecha_inicio,
                Turno.fecha_hora <= fecha_fin
            ).order_by(Turno.fecha_hora).all()
            
            current_time = fecha_inicio.replace(hour=9, minute=0, second=0)
            end_time = fecha_inicio.replace(hour=18, minute=0, second=0)
            
            while current_time <= end_time:
                disponible = True
                slot_end = current_time + timedelta(minutes=duracion)
                
                for turno in turnos:
                    turno_end = turno.fecha_hora + timedelta(minutes=turno.duracion)
                    if current_time < turno_end and slot_end > turno.fecha_hora:
                        disponible = False
                        break
                
                if disponible and current_time >= datetime.now():
                    disponibilidad.append({
                        'fecha_hora': current_time.isoformat(),
                        'empleado_id': empleado.id,
                        'empleado_nombre': empleado.nombre_completo(),
                        'servicio_id': servicio.id,
                        'servicio_nombre': servicio.nombre,
                        'duracion': duracion
                    })
                
                current_time += timedelta(minutes=15) 
        
        return disponibilidad
    
    @staticmethod
    def crear_turno(fecha_hora, cliente_id, empleado_id, servicio_id, notas=None):
        fecha_hora = datetime.strptime(fecha_hora, '%Y-%m-%dT%H:%M:%S')
        
        nuevo_turno = Turno(
            fecha_hora=fecha_hora,
            cliente_id=cliente_id,
            empleado_id=empleado_id,
            servicio_id=servicio_id,
            duracion=30, 
            estado=EstadoTurno.PENDIENTE,
            notas=notas
        )
        
        db.session.add(nuevo_turno)
        db.session.commit()
        return nuevo_turno