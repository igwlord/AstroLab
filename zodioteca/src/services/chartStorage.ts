// ============================================
// SISTEMA DE ALMACENAMIENTO HÍBRIDO DE CARTAS
// LocalStorage (siempre) + Google Drive (opcional)
// ============================================

import { logger } from '../utils/logger';

// ============================================
// TIPOS
// ============================================

export interface ChartData {
  id: string;
  personName: string;
  birthData: {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
    location?: string;
  };
  planets: any[];
  houses: any[];
  aspects: any[];
  // ... otros datos de la carta
}

export interface SavedChart {
  id: string;
  data: ChartData;
  metadata: {
    createdAt: string;
    modifiedAt: string;
    syncedAt: string | null; // Última sync con Drive
    source: 'local' | 'drive' | 'both';
    driveFileId?: string;
  };
}

export type SyncStatus = 'local-only' | 'drive-only' | 'synced' | 'conflict';

export interface ChartWithStatus extends SavedChart {
  syncStatus: SyncStatus;
  localModified?: string;
  driveModified?: string;
}

// ============================================
// CONSTANTES
// ============================================

const STORAGE_KEY = 'zodioteca_saved_charts';
const DRIVE_ACCESS_TOKEN_KEY = 'google_drive_access_token';

// ============================================
// LOCAL STORAGE OPERATIONS
// ============================================

export const getLocalCharts = (): SavedChart[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error('Error loading local charts:', error);
    return [];
  }
};

export const saveChartLocal = (chartData: ChartData, personName: string): SavedChart => {
  const charts = getLocalCharts();
  const now = new Date().toISOString();
  
  const newChart: SavedChart = {
    id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: {
      ...chartData,
      personName,
    },
    metadata: {
      createdAt: now,
      modifiedAt: now,
      syncedAt: null,
      source: 'local',
    },
  };

  charts.push(newChart);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
  
  logger.log('✅ Carta guardada localmente:', personName);
  return newChart;
};

export const updateChartLocal = (chartId: string, updates: Partial<ChartData>): SavedChart | null => {
  const charts = getLocalCharts();
  const index = charts.findIndex(c => c.id === chartId);
  
  if (index === -1) return null;
  
  charts[index].data = { ...charts[index].data, ...updates };
  charts[index].metadata.modifiedAt = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
  logger.log('✅ Carta actualizada localmente:', chartId);
  
  return charts[index];
};

export const deleteChartLocal = (chartId: string): boolean => {
  const charts = getLocalCharts();
  const filtered = charts.filter(c => c.id !== chartId);
  
  if (filtered.length === charts.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  logger.log('🗑️ Carta eliminada localmente:', chartId);
  
  return true;
};

// ============================================
// GOOGLE DRIVE OPERATIONS
// ============================================

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

export const isDriveAuthenticated = (): boolean => {
  return !!localStorage.getItem(DRIVE_ACCESS_TOKEN_KEY);
};

export const getDriveAccessToken = (): string | null => {
  return localStorage.getItem(DRIVE_ACCESS_TOKEN_KEY);
};

export const setDriveAccessToken = (token: string): void => {
  localStorage.setItem(DRIVE_ACCESS_TOKEN_KEY, token);
};

export const clearDriveAccessToken = (): void => {
  localStorage.removeItem(DRIVE_ACCESS_TOKEN_KEY);
};

// Listar archivos de Drive
export const listDriveCharts = async (): Promise<any[]> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files?` +
        new URLSearchParams({
          spaces: 'appDataFolder',
          q: "mimeType='application/json' and name contains 'zodioteca_chart_'",
          fields: 'files(id, name, modifiedTime)',
          orderBy: 'modifiedTime desc',
        }),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        clearDriveAccessToken();
        throw new Error('Drive token expired');
      }
      throw new Error(`Drive API error: ${response.status}`);
    }

    const data = await response.json();
    logger.log('📂 Archivos encontrados en Drive:', data.files?.length || 0);
    
    return data.files || [];
  } catch (error) {
    logger.error('Error listing Drive charts:', error);
    throw error;
  }
};

// Descargar contenido de un archivo
export const downloadDriveChart = async (fileId: string): Promise<SavedChart> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  try {
    const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Failed to download chart: ${response.status}`);

    const chart = await response.json();
    return chart;
  } catch (error) {
    logger.error('Error downloading chart from Drive:', error);
    throw error;
  }
};

// Subir carta a Drive
export const uploadChartToDrive = async (chart: SavedChart): Promise<string> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  try {
    const fileName = `zodioteca_chart_${chart.id}.json`;
    
    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: ['appDataFolder'],
    };

    const chartWithSync = {
      ...chart,
      metadata: {
        ...chart.metadata,
        syncedAt: new Date().toISOString(),
        source: 'both' as const,
      },
    };

    const blob = new Blob([JSON.stringify(chartWithSync, null, 2)], {
      type: 'application/json',
    });

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', blob);

    const response = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error(`Failed to upload: ${response.status}`);

    const data = await response.json();
    logger.log('☁️ Carta subida a Drive:', data.id);
    
    return data.id;
  } catch (error) {
    logger.error('Error uploading to Drive:', error);
    throw error;
  }
};

// Actualizar carta en Drive
export const updateChartInDrive = async (fileId: string, chart: SavedChart): Promise<void> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  try {
    const chartWithSync = {
      ...chart,
      metadata: {
        ...chart.metadata,
        modifiedAt: new Date().toISOString(),
        syncedAt: new Date().toISOString(),
        source: 'both' as const,
      },
    };

    const response = await fetch(`${DRIVE_UPLOAD_BASE}/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chartWithSync),
    });

    if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
    
    logger.log('☁️ Carta actualizada en Drive:', fileId);
  } catch (error) {
    logger.error('Error updating Drive chart:', error);
    throw error;
  }
};

// Eliminar de Drive
export const deleteChartFromDrive = async (fileId: string): Promise<void> => {
  const token = getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  try {
    const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete: ${response.status}`);
    }
    
    logger.log('🗑️ Carta eliminada de Drive:', fileId);
  } catch (error) {
    logger.error('Error deleting from Drive:', error);
    throw error;
  }
};

// ============================================
// SINCRONIZACIÓN INTELIGENTE
// ============================================

export const compareCharts = (localChart: SavedChart, driveChart: SavedChart): SyncStatus => {
  const localTime = new Date(localChart.metadata.modifiedAt).getTime();
  const driveTime = new Date(driveChart.metadata.modifiedAt).getTime();
  const syncTime = localChart.metadata.syncedAt 
    ? new Date(localChart.metadata.syncedAt).getTime() 
    : 0;

  // Si ambos fueron modificados después de la última sync
  if (localTime > syncTime && driveTime > syncTime && localTime !== driveTime) {
    return 'conflict';
  }

  // Si están sincronizados
  if (localTime === driveTime || Math.abs(localTime - driveTime) < 1000) {
    return 'synced';
  }

  return 'synced'; // Por defecto
};

export const getChartsWithStatus = async (): Promise<ChartWithStatus[]> => {
  const localCharts = getLocalCharts();
  
  if (!isDriveAuthenticated()) {
    return localCharts.map(chart => ({
      ...chart,
      syncStatus: 'local-only' as SyncStatus,
    }));
  }

  try {
    const driveFiles = await listDriveCharts();
    const driveChartsMap = new Map<string, any>();

    // Descargar y mapear cartas de Drive
    for (const file of driveFiles) {
      try {
        const chart = await downloadDriveChart(file.id);
        driveChartsMap.set(chart.id, { chart, fileId: file.id, modifiedTime: file.modifiedTime });
      } catch (error) {
        logger.error(`Error downloading chart ${file.id}:`, error);
      }
    }

    const chartsWithStatus: ChartWithStatus[] = [];
    const processedIds = new Set<string>();

    // Procesar cartas locales
    for (const localChart of localCharts) {
      processedIds.add(localChart.id);
      const driveData = driveChartsMap.get(localChart.id);

      if (!driveData) {
        chartsWithStatus.push({
          ...localChart,
          syncStatus: 'local-only',
        });
      } else {
        const status = compareCharts(localChart, driveData.chart);
        chartsWithStatus.push({
          ...localChart,
          syncStatus: status,
          localModified: localChart.metadata.modifiedAt,
          driveModified: driveData.modifiedTime,
          metadata: {
            ...localChart.metadata,
            driveFileId: driveData.fileId,
          },
        });
      }
    }

    // Procesar cartas solo en Drive
    for (const [chartId, driveData] of driveChartsMap.entries()) {
      if (!processedIds.has(chartId)) {
        chartsWithStatus.push({
          ...driveData.chart,
          syncStatus: 'drive-only',
          driveModified: driveData.modifiedTime,
          metadata: {
            ...driveData.chart.metadata,
            driveFileId: driveData.fileId,
          },
        });
      }
    }

    return chartsWithStatus;
  } catch (error) {
    logger.error('Error getting charts with status:', error);
    return localCharts.map(chart => ({
      ...chart,
      syncStatus: 'local-only' as SyncStatus,
    }));
  }
};

// ============================================
// OPERACIONES DE SINCRONIZACIÓN
// ============================================

export const syncChartToCloud = async (chart: ChartWithStatus): Promise<void> => {
  if (chart.syncStatus === 'local-only') {
    const fileId = await uploadChartToDrive(chart);
    
    // Actualizar local con fileId
    const localCharts = getLocalCharts();
    const index = localCharts.findIndex(c => c.id === chart.id);
    if (index !== -1) {
      localCharts[index].metadata.driveFileId = fileId;
      localCharts[index].metadata.syncedAt = new Date().toISOString();
      localCharts[index].metadata.source = 'both';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localCharts));
    }
  } else if (chart.syncStatus === 'drive-only') {
    // Descargar a local
    const charts = getLocalCharts();
    charts.push(chart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
  } else if (chart.metadata.driveFileId) {
    // Actualizar en Drive
    await updateChartInDrive(chart.metadata.driveFileId, chart);
    
    // Actualizar metadata local
    const localCharts = getLocalCharts();
    const index = localCharts.findIndex(c => c.id === chart.id);
    if (index !== -1) {
      localCharts[index].metadata.syncedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localCharts));
    }
  }
};

export const syncAllCharts = async (charts: ChartWithStatus[]): Promise<void> => {
  for (const chart of charts) {
    if (chart.syncStatus !== 'synced' && chart.syncStatus !== 'conflict') {
      try {
        await syncChartToCloud(chart);
      } catch (error) {
        logger.error(`Error syncing chart ${chart.id}:`, error);
      }
    }
  }
};

// ============================================
// EXPORTAR/IMPORTAR
// ============================================

export const exportChartsToJSON = (): void => {
  const charts = getLocalCharts();
  const dataStr = JSON.stringify(charts, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `zodioteca_charts_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  logger.log('📥 Cartas exportadas:', charts.length);
};

export const importChartsFromJSON = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as SavedChart[];
        const existing = getLocalCharts();
        const existingIds = new Set(existing.map(c => c.id));
        
        const newCharts = imported.filter(c => !existingIds.has(c.id));
        const merged = [...existing, ...newCharts];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        logger.log('📤 Cartas importadas:', newCharts.length);
        
        resolve(newCharts.length);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
