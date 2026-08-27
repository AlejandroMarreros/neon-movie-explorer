import { useState, useEffect } from "react";
import { indexAdmin } from "../indexAdmin";

const reactionTypes = [
  { name: "like", icon: "👍", label: "Me gusta" },
  { name: "love", icon: "❤️", label: "Me encanta" },
  { name: "fish_eyes", icon: "🐟", label: "Ojos de pescado" },
  { name: "serious", icon: "😐", label: "Serio" },
];

const Comments = ({ movieId, movieTitle }) => {
  const storageKey = `comments_${movieId}`;

  // Cargar comentarios persistidos específicos de este movieId
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error al cargar comentarios de localStorage:", e);
      return [];
    }
  });

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Guardar comentarios en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (e) {
      console.error("Error al guardar comentarios:", e);
    }
  }, [comments, storageKey]);

  // Temporizador para feedback toast
  const showFeedback = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin.toLowerCase() === "admin") {
      setIsAdminAuthenticated(true);
      showFeedback("Acceso concedido al panel de moderación");
    } else {
      showFeedback("PIN incorrecto. (Usa: 1234 o 'admin')");
    }
    setAdminPin("");
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;

    if (cleanText.length > indexAdmin.MAX_LENGTH) {
      showFeedback(`El texto supera el límite de ${indexAdmin.MAX_LENGTH} caracteres.`);
      return;
    }

    if (editingId) {
      setComments((prev) => indexAdmin.updateText(prev, editingId, cleanText));
      setEditingId(null);
      showFeedback("Comentario actualizado exitosamente");
    } else if (replyTo) {
      setComments((prev) =>
        indexAdmin.addReply(prev, replyTo, cleanText, author.trim() || "Cinéfilo Neon")
      );
      setReplyTo(null);
      showFeedback("Respuesta publicada");
    } else {
      const newComment = indexAdmin.createComment(cleanText, author.trim() || "Cinéfilo Neon");
      setComments((prev) => [newComment, ...prev]);
      showFeedback("Comentario publicado");
    }

    setText("");
  };

  const handleStartEdit = (comment) => {
    setText(comment.text);
    setEditingId(comment.id);
    setReplyTo(null);
  };

  const handleStartReply = (commentId) => {
    setReplyTo(commentId);
    setEditingId(null);
    setText("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setReplyTo(null);
    setText("");
  };

  const handleReport = (id) => {
    setComments((prev) => indexAdmin.reportComment(prev, id));
    showFeedback("Comentario marcado para revisión del moderador");
  };

  const handleRemove = (id) => {
    setComments((prev) => indexAdmin.removeComment(prev, id));
    showFeedback("Comentario eliminado");
  };

  const handleDismissReport = (id) => {
    setComments((prev) => indexAdmin.dismissReport(prev, id));
    showFeedback("Reporte desestimado (comentario restaurado)");
  };

  const handleReaction = (id, type) => {
    setComments((prev) => indexAdmin.addReaction(prev, id, type));
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const reportedList = indexAdmin.getReported(comments);

  return (
    <section className="comments-section" aria-label="Sección de comentarios de la comunidad">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="neon-toast" role="status">
          {toastMessage}
        </div>
      )}

      <div className="comments-header">
        <div>
          <h3 className="comments-section-title">
            💬 Comunidad Neon {movieTitle ? `// ${movieTitle}` : ""}
          </h3>
          <p className="comments-section-subtitle">
            {comments.length} comentario{comments.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          className="btn-admin-toggle"
          onClick={() => setIsAdminView(!isAdminView)}
          aria-expanded={isAdminView}
        >
          {isAdminView ? "🌐 Volver a Vista Pública" : "🛡️ Panel Admin"}
        </button>
      </div>

      {!isAdminView ? (
        <>
          {/* Formulario de Comentarios */}
          <form onSubmit={handleSubmit} className="comment-form-box">
            <div className="form-input-row">
              <input
                type="text"
                placeholder="Tu alias o nombre (opcional)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={40}
                className="input-author"
                aria-label="Nombre o alias"
              />
              <span className="char-counter">
                {text.length}/{indexAdmin.MAX_LENGTH}
              </span>
            </div>

            <div className="form-textarea-row">
              <textarea
                placeholder={
                  editingId
                    ? "Editando comentario..."
                    : replyTo
                    ? "Escribe tu respuesta..."
                    : "Comparte tu opinión sobre esta película..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={indexAdmin.MAX_LENGTH}
                className="comment-textarea"
                rows={3}
                aria-label="Contenido del comentario"
              />
            </div>

            <div className="comment-form-actions">
              {(editingId || replyTo) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-cancel-action"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={!text.trim()}
                className="btn-submit-comment"
              >
                {editingId ? "💾 Guardar Edición" : replyTo ? "↩️ Responder" : "➕ Publicar Comentario"}
              </button>
            </div>
          </form>

          {/* Lista de Comentarios */}
          <div className="comments-list" role="feed" aria-label="Lista de comentarios">
            {comments.length === 0 ? (
              <p className="no-comments-message">
                Aún no hay comentarios sobre esta película. ¡Sé el primero en opinar!
              </p>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className={`comment-card ${comment.isReported ? "is-reported-card" : ""}`}
                >
                  <header className="comment-card-header">
                    <span className="comment-author">👤 {comment.author || "Cinéfilo Neon"}</span>
                    <time className="comment-date" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  </header>

                  <div className="comment-text-content">{comment.text}</div>

                  {comment.isReported && (
                    <div className="reported-warning-tag">
                      ⚠️ Este comentario ha sido reportado y está en revisión.
                    </div>
                  )}

                  {/* Acciones del comentario */}
                  <footer className="comment-card-footer">
                    <div className="comment-actions-buttons">
                      <button
                        type="button"
                        onClick={() => handleStartReply(comment.id)}
                        className="btn-comment-link"
                      >
                        💬 Responder
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(comment)}
                        className="btn-comment-link"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(comment.id)}
                        className="btn-comment-link btn-comment-danger"
                      >
                        🗑️ Borrar
                      </button>
                      {!comment.isReported && (
                        <button
                          type="button"
                          onClick={() => handleReport(comment.id)}
                          className="btn-comment-link btn-comment-report"
                        >
                          🚩 Reportar
                        </button>
                      )}
                    </div>

                    {/* Barra de Reacciones */}
                    <div className="reactions-group" aria-label="Reacciones al comentario">
                      {reactionTypes.map((r) => (
                        <button
                          key={r.name}
                          type="button"
                          className="btn-reaction"
                          onClick={() => handleReaction(comment.id, r.name)}
                          aria-label={`${r.label}: ${comment.reactions?.[r.name] || 0}`}
                        >
                          <span aria-hidden="true">{r.icon}</span>
                          <span className="reaction-count">
                            {comment.reactions?.[r.name] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </footer>

                  {/* Render de Respuestas anidadas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-wrapper" aria-label="Respuestas al comentario">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="reply-card">
                          <header className="reply-header">
                            <span className="reply-author">↳ {reply.author || "Cinéfilo Neon"}</span>
                            <time className="reply-date" dateTime={reply.createdAt}>
                              {formatDate(reply.createdAt)}
                            </time>
                          </header>
                          <div className="reply-text">{reply.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </>
      ) : (
        /* VISTA PANEL ADMIN */
        <div className="admin-panel-container">
          <h4 className="admin-panel-title">🛡️ Panel de Moderación Comunitario</h4>

          {!isAdminAuthenticated ? (
            <form onSubmit={handleAdminAuth} className="admin-auth-box">
              <p className="admin-auth-instruction">
                Introduce el PIN de administrador para gestionar los reportes (Demo PIN: <strong>1234</strong>):
              </p>
              <div className="admin-auth-row">
                <input
                  type="password"
                  placeholder="PIN de acceso"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="input-admin-pin"
                  maxLength={10}
                />
                <button type="submit" className="btn-admin-login">
                  Ingresar
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-reports-list">
              <div className="admin-reports-header">
                <h5>🚨 Comentarios Reportados ({reportedList.length})</h5>
                <button
                  type="button"
                  className="btn-admin-logout"
                  onClick={() => setIsAdminAuthenticated(false)}
                >
                  Cerrar Sesión Admin
                </button>
              </div>

              {reportedList.length === 0 ? (
                <p className="no-reports-msg">✅ No hay comentarios reportados pendientes de revisión.</p>
              ) : (
                reportedList.map((item) => (
                  <div key={item.id} className="admin-reported-card">
                    <p className="admin-reported-text">"{item.text}"</p>
                    <div className="admin-reported-meta">
                      <span>Autor: {item.author || "Anónimo"}</span>
                      <span>Fecha: {formatDate(item.createdAt)}</span>
                    </div>
                    <div className="admin-decision-buttons">
                      <button
                        type="button"
                        className="btn-decision-keep"
                        onClick={() => handleDismissReport(item.id)}
                      >
                        ✅ Desestimar Reporte (Mantener)
                      </button>
                      <button
                        type="button"
                        className="btn-decision-delete"
                        onClick={() => handleRemove(item.id)}
                      >
                        🗑️ Eliminar Definitivamente
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Comments;