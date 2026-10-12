import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import {
  getToken, setToken, clearToken, getGistId,
  verifyToken, uploadToGist, downloadFromGist, findResumeGist,
} from '../utils/gist';
import type { ResumeEntry } from '../types/resume';

type SyncStatus = 'idle' | 'verifying' | 'uploading' | 'downloading' | 'success' | 'error';

export default function CloudSync() {
  const { t, i18n } = useTranslation();
  const { entries, restoreEntries } = useResume();
  const isZh = i18n.language === 'zh';

  const [open, setOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [message, setMessage] = useState('');
  const [githubLogin, setGithubLogin] = useState<string | null>(null);

  const hasToken = !!getToken();
  const hasGist = !!getGistId();

  // Close modal
  const close = useCallback(() => {
    setOpen(false);
    setStatus('idle');
    setMessage('');
    setTokenInput('');
  }, []);

  // Verify and save token
  const handleConnect = useCallback(async () => {
    const token = tokenInput.trim();
    if (!token) return;

    setStatus('verifying');
    setMessage('');

    const result = await verifyToken(token);
    if (result.ok) {
      setToken(token);
      setGithubLogin(result.login || null);
      setStatus('success');
      setMessage(isZh ? `已连接: ${result.login}` : `Connected: ${result.login}`);

      // Check if there's an existing gist
      const gistId = getGistId();
      if (!gistId) {
        const found = await findResumeGist(token);
        if (found) {
          // Store found gist id
          localStorage.setItem('resume-gist-id', found);
          setMessage(isZh ? `已连接: ${result.login}，发现云端数据` : `Connected: ${result.login}, cloud data found`);
        }
      }
    } else {
      setStatus('error');
      setMessage(isZh ? `连接失败: ${result.message}` : `Failed: ${result.message}`);
    }
  }, [tokenInput, isZh]);

  // Upload to cloud
  const handleUpload = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    if (entries.length === 0) {
      setStatus('error');
      setMessage(isZh ? '没有可上传的简历' : 'No resumes to upload');
      return;
    }

    setStatus('uploading');
    setMessage('');

    // Prepare data for upload (exclude photo base64 to save space, store separately)
    const uploadData = entries.map(e => ({
      ...e,
      data: {
        ...e.data,
        basicInfo: { ...e.data.basicInfo, photo: '' }, // Don't store photo in gist (too large)
      },
    }));

    const gistId = getGistId() || undefined;
    const result = await uploadToGist(JSON.stringify(uploadData, null, 2), token, gistId);

    if (result.success) {
      setStatus('success');
      setMessage(isZh ? `已上传 ${entries.length} 份简历到云端` : `Uploaded ${entries.length} resume(s) to cloud`);
    } else {
      setStatus('error');
      setMessage(isZh ? `上传失败: ${result.message}` : `Upload failed: ${result.message}`);
    }
  }, [entries, isZh]);

  // Download from cloud
  const handleDownload = useCallback(async () => {
    const token = getToken();
    const gistId = getGistId();
    if (!token || !gistId) return;

    setStatus('downloading');
    setMessage('');

    const result = await downloadFromGist(token, gistId);
    if (result.success && result.data) {
      try {
        const cloudEntries: ResumeEntry[] = JSON.parse(result.data);
        if (Array.isArray(cloudEntries) && cloudEntries.length > 0) {
          restoreEntries(cloudEntries);
          setStatus('success');
          setMessage(isZh ? `已从云端恢复 ${cloudEntries.length} 份简历` : `Restored ${cloudEntries.length} resume(s) from cloud`);
        } else {
          setStatus('error');
          setMessage(isZh ? '云端数据格式无效' : 'Invalid cloud data format');
        }
      } catch {
        setStatus('error');
        setMessage(isZh ? '云端数据解析失败' : 'Failed to parse cloud data');
      }
    } else {
      setStatus('error');
      setMessage(isZh ? `下载失败: ${result.message}` : `Download failed: ${result.message}`);
    }
  }, [isZh, restoreEntries]);

  // Disconnect
  const handleDisconnect = useCallback(() => {
    clearToken();
    setGithubLogin(null);
    setTokenInput('');
    setStatus('idle');
    setMessage('');
  }, []);

  // Init login state
  const handleOpen = useCallback(() => {
    setOpen(true);
    const savedToken = getToken();
    if (savedToken) {
      setTokenInput('');
      // Verify saved token silently
      verifyToken(savedToken).then(r => {
        if (r.ok) setGithubLogin(r.login || 'GitHub');
      });
    }
  }, []);

  const statusColor = {
    idle: 'text-sf-muted',
    verifying: 'text-blue-600',
    uploading: 'text-blue-600',
    downloading: 'text-blue-600',
    success: 'text-green-700',
    error: 'text-red-400',
  }[status];

  const isLoading = status === 'verifying' || status === 'uploading' || status === 'downloading';

  return (
    <>
      {/* Cloud sync button */}
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors font-mono
          ${hasToken ? 'text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20' : 'text-sf-muted bg-sf-card hover:bg-sf-hover border border-sf-border'}`}
        title={t('cloud.title')}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3 3 0 013.182 4.377A3.75 3.75 0 0118 19.5H6.75z" />
        </svg>
        {hasToken ? t('cloud.connected') : t('cloud.sync')}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={close}>
          <div className="bg-sf-surface rounded-lg shadow-2xl w-[420px] max-h-[80vh] overflow-auto border border-sf-border" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-sf-border">
              <h3 className="text-sm font-bold text-sf-text font-mono flex items-center gap-2">
                <span className="text-primary">❯</span> {t('cloud.title')}
              </h3>
              <button onClick={close} className="p-1 rounded hover:bg-sf-hover text-sf-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Connection status */}
              {hasToken && githubLogin && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-700 font-mono">
                    {isZh ? `已连接 GitHub: ` : `Connected to GitHub: `}
                    <strong>{githubLogin}</strong>
                  </span>
                </div>
              )}

              {/* Token input (when not connected) */}
              {!hasToken && (
                <div>
                  <label className="block text-xs font-medium text-sf-muted mb-1.5 font-mono">
                    GitHub Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="input-field" 
                    onKeyDown={e => e.key === 'Enter' && handleConnect()}
                  />
                  <p className="mt-1.5 text-[10px] text-sf-muted leading-relaxed font-mono">
                    {isZh
                      ? 'Token 仅存储在本浏览器，用于访问 GitHub Gist API 保存简历数据。'
                      : 'Token is stored only in this browser, used to access GitHub Gist API for saving resume data.'}
                  </p>
                  <a
                    href="https://github.com/settings/tokens/new?description=Resume+Editor&scopes=gist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-[10px] text-primary hover:underline font-mono"
                  >
                    {isZh ? '→ 点击生成 Token（仅需 gist 权限）' : '→ Click to generate Token (gist permission only)'}
                  </a>
                </div>
              )}

              {/* Status message */}
              {message && (
                <div className={`text-xs ${statusColor} flex items-center gap-1.5`}>
                  {isLoading && (
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {message}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {!hasToken ? (
                  <button
                    onClick={handleConnect}
                    disabled={!tokenInput.trim() || isLoading}
                    className="flex-1 py-2 text-xs font-medium text-white bg-primary rounded
                               hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                  >
                    {isZh ? '连接' : 'Connect'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpload}
                      disabled={isLoading}
                      className="flex-1 py-2 text-xs font-medium text-white bg-primary rounded
                                 hover:bg-secondary disabled:opacity-40 transition-colors font-mono"
                    >
                      {isZh ? '↑ 上传到云端' : '↑ Upload to Cloud'}
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={isLoading || !hasGist}
                      className="flex-1 py-2 text-xs font-medium text-primary bg-primary/10 rounded border border-primary/20
                                 hover:bg-primary/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                      title={!hasGist ? (isZh ? '云端暂无数据' : 'No cloud data') : undefined}
                    >
                      {isZh ? '↓ 从云端恢复' : '↓ Restore from Cloud'}
                    </button>
                  </>
                )}
              </div>

              {/* Disconnect */}
              {hasToken && (
                <button
                  onClick={handleDisconnect}
                  className="w-full py-1.5 text-[11px] text-sf-muted hover:text-red-500 transition-colors font-mono"
                >
                  {isZh ? '断开连接并清除本地 Token' : 'Disconnect and clear local Token'}
                </button>
              )}

              {/* Help text */}
              <div className="text-[10px] text-sf-muted leading-relaxed border-t border-sf-border pt-3 font-mono">
                {isZh
                  ? '简历数据以 Secret Gist 形式保存在你的 GitHub 账号中，仅自己可见。照片因体积较大不会同步到云端。'
                  : 'Resume data is saved as a Secret Gist in your GitHub account, visible only to you. Photos are not synced due to size.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
