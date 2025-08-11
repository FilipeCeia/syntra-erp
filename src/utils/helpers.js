

const moment = require('moment');

class Helpers {
  // Formatar moeda moçambicana
  static formatMoney(value) {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(value || 0);
  }

  // Formatar número
  static formatNumber(value, decimals = 2) {
    return new Intl.NumberFormat('pt-MZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value || 0);
  }

  // Formatar data
  static formatDate(date, format = 'DD/MM/YYYY') {
    return moment(date).format(format);
  }

  // Gerar código automático
  static generateCode(prefix, number, length = 6) {
    return `${prefix}${number.toString().padStart(length, '0')}`;
  }

  // Validar NUIT moçambicano
  static validateNUIT(nuit) {
    if (!nuit || nuit.length !== 9) return false;
    
    // Algoritmo básico de validação de NUIT
    const digits = nuit.split('').map(Number);
    const check = digits.pop();
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (9 - i);
    }
    
    const remainder = sum % 11;
    const expectedCheck = remainder < 2 ? remainder : 11 - remainder;
    
    return check === expectedCheck;
  }

  // Calcular IVA
  static calculateIVA(value, rate, included = true) {
    if (included) {
      // IVA incluído no preço
      const ivaValue = (value * rate) / (100 + rate);
      return {
        baseValue: value - ivaValue,
        ivaValue: ivaValue,
        totalValue: value
      };
    } else {
      // IVA por fora
      const ivaValue = (value * rate) / 100;
      return {
        baseValue: value,
        ivaValue: ivaValue,
        totalValue: value + ivaValue
      };
    }
  }

  // Gerar hash para sessão
  static generateSessionHash() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  // Sanitizar string para nome de arquivo
  static sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  // Paginar resultados
  static paginate(totalRecords, currentPage, limit = 10) {
    const totalPages = Math.ceil(totalRecords / limit);
    const offset = (currentPage - 1) * limit;
    
    return {
      totalPages,
      currentPage,
      limit,
      offset,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null
    };
  }

  // Status de documentos
  static getStatusLabel(status, type = 'general') {
    const statusMap = {
      general: {
        1: { label: 'Ativo', class: 'success' },
        0: { label: 'Inativo', class: 'secondary' }
      },
      client: {
        1: { label: 'Ativo', class: 'success' },
        2: { label: 'Inativo', class: 'secondary' },
        3: { label: 'Bloqueado', class: 'danger' }
      },
      payment: {
        1: { label: 'Pendente', class: 'warning' },
        2: { label: 'Pago Parcial', class: 'info' },
        3: { label: 'Pago', class: 'success' },
        4: { label: 'Vencido', class: 'danger' },
        5: { label: 'Cancelado', class: 'dark' }
      }
    };
    
    return statusMap[type]?.[status] || { label: 'Desconhecido', class: 'secondary' };
  }
}

module.exports = Helpers;
