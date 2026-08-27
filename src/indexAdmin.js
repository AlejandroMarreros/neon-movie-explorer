// src/indexAdmin.js - Gestor de Lógica de Comentarios y Moderación

export const indexAdmin = {
  // LÍMITES
  MAX_LENGTH: 500,

  // CREAR: Estructura base de comentario con ID único y fecha
  createComment: (text, author = "Cinéfilo Neon") => {
    const sanitizedText = (text || "").trim().slice(0, indexAdmin.MAX_LENGTH);
    return {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: sanitizedText,
      author: (author || "Cinéfilo Neon").trim().slice(0, 40),
      createdAt: new Date().toISOString(),
      reactions: { like: 0, love: 0, fish_eyes: 0, serious: 0 },
      replies: [],
      isReported: false,
    };
  },

  // LEER/FILTRAR: Comentarios reportados para el panel de administración
  getReported: (comments = []) => {
    return comments.filter((c) => c.isReported === true);
  },

  // ACTUALIZAR: Edición del texto de un comentario
  updateText: (comments = [], id, newText) => {
    const sanitizedText = (newText || "").trim().slice(0, indexAdmin.MAX_LENGTH);
    return comments.map((c) =>
      c.id === id ? { ...c, text: sanitizedText, editedAt: new Date().toISOString() } : c
    );
  },

  // RESPONDER: Añadir respuesta a un comentario padre
  addReply: (comments = [], parentId, replyText, author = "Cinéfilo Neon") => {
    const sanitizedText = (replyText || "").trim().slice(0, indexAdmin.MAX_LENGTH);
    return comments.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              text: sanitizedText,
              author: (author || "Cinéfilo Neon").trim().slice(0, 40),
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
  },

  // REACCIONAR: Incrementar contador de reacciones
  addReaction: (comments = [], id, type) => {
    return comments.map((c) => {
      if (c.id === id) {
        const currentCount = c.reactions?.[type] || 0;
        return {
          ...c,
          reactions: {
            ...c.reactions,
            [type]: currentCount + 1,
          },
        };
      }
      return c;
    });
  },

  // REPORTAR: Marcar comentario para revisión
  reportComment: (comments = [], id) => {
    return comments.map((c) =>
      c.id === id ? { ...c, isReported: true, reportedAt: new Date().toISOString() } : c
    );
  },

  // LIMPIAR: Descartar reporte (mantener comentario)
  dismissReport: (comments = [], id) => {
    return comments.map((c) =>
      c.id === id ? { ...c, isReported: false } : c
    );
  },

  // ELIMINAR: Borrado físico
  removeComment: (comments = [], id) => {
    return comments.filter((c) => c.id !== id);
  },
};