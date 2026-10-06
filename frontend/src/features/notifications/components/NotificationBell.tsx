import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotifications';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const unreadCount = data?.unread_count ?? 0;
  const alerts = data?.alerts ?? [];
  const notifications = data?.notifications ?? [];

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGoToTransactions = () => {
    setIsOpen(false);
    navigate('/transactions');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          minWidth: '40px',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: unreadCount > 0 ? 'var(--primary-700)' : 'var(--text-muted)',
          backgroundColor: isOpen ? 'var(--bg-muted)' : 'transparent',
          borderRadius: 'var(--radius-full)',
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        aria-label={`Notificações ${unreadCount > 0 ? `(${unreadCount} novas)` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 2px var(--bg-surface)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '480px',
            animation: 'fadeIn 150ms ease-out',
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              padding: 'var(--spacing-md)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                Alertas e Notificações
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--primary-700)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Marcar todas como lidas"
              >
                <CheckCheck size={14} />
                <span>Ler todas</span>
              </button>
            )}
          </div>

          {/* Conteúdo scrollável */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 'var(--spacing-xs)' }}>
            {isLoading ? (
              <div
                style={{
                  padding: 'var(--spacing-lg)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                Carregando alertas...
              </div>
            ) : alerts.length === 0 && notifications.length === 0 ? (
              <div
                style={{
                  padding: 'var(--spacing-xl)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <Bell size={28} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>
                  Nenhum alerta pendente
                </p>
                <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>
                  Suas contas e finanças estão em dia!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Alertas Urgentes de Vencimentos */}
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: 'var(--spacing-sm)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: alert.type === 'DANGER' ? '#fef2f2' : '#fffbeb',
                      borderLeft: `4px solid ${alert.type === 'DANGER' ? '#ef4444' : '#f59e0b'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: alert.type === 'DANGER' ? '#b91c1c' : '#b45309',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                        }}
                      >
                        {alert.type === 'DANGER' ? (
                          <AlertCircle size={15} />
                        ) : (
                          <AlertTriangle size={15} />
                        )}
                        <span>{alert.title}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <Clock size={11} />
                        {alert.date}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {alert.message}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '2px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleGoToTransactions}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.75rem',
                          color: 'var(--primary-700)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 500,
                          padding: '2px 4px',
                        }}
                      >
                        <span>Ver no extrato</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Notificações do Sistema */}
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    style={{
                      padding: 'var(--spacing-sm)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: notif.read_at ? 'transparent' : 'var(--bg-muted)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: notif.read_at ? 500 : 600,
                          fontSize: '0.8125rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        {notif.title}
                      </span>
                      {!notif.read_at && (
                        <button
                          type="button"
                          onClick={() => markAsReadMutation.mutate(notif.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.6875rem',
                            color: 'var(--primary-700)',
                            cursor: 'pointer',
                          }}
                        >
                          Marcar lida
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
