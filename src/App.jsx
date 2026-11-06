import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const starterClasses = [
  {
    id: 'user',
    name: 'User',
    stereotype: 'entity',
    x: 92,
    y: 115,
    attributes: [
      { id: 'a1', visibility: '-', name: 'id', type: 'Long' },
      { id: 'a2', visibility: '-', name: 'name', type: 'String' },
      { id: 'a3', visibility: '-', name: 'email', type: 'String' },
    ],
    methods: [
      { id: 'm1', visibility: '+', name: 'login', returnType: 'boolean' },
      { id: 'm2', visibility: '+', name: 'logout', returnType: 'void' },
    ],
  },
  {
    id: 'order',
    name: 'Order',
    stereotype: 'entity',
    x: 445,
    y: 335,
    attributes: [
      { id: 'a4', visibility: '-', name: 'orderId', type: 'Long' },
      { id: 'a5', visibility: '-', name: 'total', type: 'double' },
      { id: 'a6', visibility: '-', name: 'status', type: 'String' },
    ],
    methods: [
      { id: 'm3', visibility: '+', name: 'calculateTotal', returnType: 'double' },
      { id: 'm4', visibility: '+', name: 'submit', returnType: 'void' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    stereotype: 'entity',
    x: 785,
    y: 112,
    attributes: [
      { id: 'a7', visibility: '-', name: 'sku', type: 'String' },
      { id: 'a8', visibility: '-', name: 'price', type: 'double' },
    ],
    methods: [
      { id: 'm5', visibility: '+', name: 'isAvailable', returnType: 'boolean' },
    ],
  },
];

const starterRelationships = [
  { id: 'r1', from: 'user', to: 'order', type: 'association', label: 'places' },
  { id: 'r2', from: 'order', to: 'product', type: 'association', label: 'contains' },
];

const icons = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  code: <><path d="m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 1 1-3.4 0v-.15a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 1 1 0-3.4h.15a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 1 1 3.4 0v.15a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.3a1.7 1.7 0 1 1 0 3.4h-.15a1.7 1.7 0 0 0-1.2 2.9Z" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  down: <><path d="m7 10 5 5 5-5" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  cursor: <><path d="m5 3 14 9-7 1-3 7Z" /></>,
  zoomIn: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4m-5-8v6m-3-3h6" /></>,
  zoomOut: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4m-8-5h6" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z" /></>,
};

function Icon({ name, size = 18, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function findOpenPosition(classes) {
  const positions = [92, 445, 785].flatMap((x) => [115, 335, 555].map((y) => ({ x, y })));
  return positions.find((position) => classes.every((item) => (
    Math.abs(item.x - position.x) >= 270 || Math.abs(item.y - position.y) >= 205
  ))) || { x: 92 + (classes.length % 3) * 340, y: 115 + Math.floor(classes.length / 3) * 220 };
}

function safeJavaName(value) {
  const words = value.trim().split(/[^a-zA-Z0-9_$]+/).filter(Boolean);
  const name = words.map((word) => word[0].toUpperCase() + word.slice(1)).join('');
  return /^[A-Za-z_$]/.test(name) ? name : `Class${name}`;
}

function safeJavaIdentifier(value) {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_$]/g, '');
  return /^[A-Za-z_$]/.test(cleaned) ? cleaned : `field${cleaned}`;
}

function generateJava(classItem, relationships) {
  const isInterface = classItem.stereotype === 'interface';
  const inherited = relationships.filter((relationship) => relationship.type === 'inheritance' && relationship.from === classItem.id);
  const classParent = inherited.find((relationship) => relationship.toStereotype !== 'interface');
  const interfaces = inherited.filter((relationship) => relationship.toStereotype === 'interface');
  const extendsClause = isInterface
    ? interfaces.length ? ` extends ${interfaces.map((relationship) => safeJavaName(relationship.toClassName)).join(', ')}` : ''
    : classParent ? ` extends ${safeJavaName(classParent.toClassName)}` : '';
  const implementsClause = !isInterface && interfaces.length
    ? ` implements ${interfaces.map((relationship) => safeJavaName(relationship.toClassName)).join(', ')}`
    : '';
  const declaration = isInterface ? 'interface' : `${classItem.stereotype === 'abstract' ? 'abstract ' : ''}class`;
  const lines = [`public ${declaration} ${safeJavaName(classItem.name)}${extendsClause}${implementsClause} {`];
  const associations = relationships.filter((relationship) => relationship.type === 'association' && relationship.from === classItem.id);

  if (isInterface) {
    inherited.filter((relationship) => relationship.toStereotype !== 'interface').forEach((relationship) => {
      lines.push(`    // UML inheritance from class ${safeJavaName(relationship.toClassName)} cannot be represented by an interface.`);
    });
  }

  if (isInterface) {
    classItem.attributes.forEach((attribute) => {
      lines.push(`    ${attribute.type.trim() || 'Object'} get${safeJavaName(attribute.name)}();`);
    });
    associations.forEach((relationship) => {
      const propertyName = relationship.label || relationship.toClassName;
      lines.push(`    ${safeJavaName(relationship.toClassName)} get${safeJavaName(propertyName)}();`);
    });
  } else {
    classItem.attributes.forEach((attribute) => {
      const visibility = attribute.visibility === '#' ? 'protected' : attribute.visibility === '+' ? 'public' : 'private';
      lines.push(`    ${visibility} ${attribute.type.trim() || 'Object'} ${safeJavaIdentifier(attribute.name)};`);
    });
    associations.forEach((relationship) => {
      const propertyName = relationship.label || relationship.toClassName.charAt(0).toLowerCase() + relationship.toClassName.slice(1);
      lines.push(`    private ${safeJavaName(relationship.toClassName)} ${safeJavaIdentifier(propertyName)};`);
    });
  }

  if ((isInterface && (classItem.attributes.length || associations.length)) || (!isInterface && (classItem.attributes.length || associations.length))) {
    lines.push('');
  }

  classItem.methods.forEach((method, index) => {
    if (!method.name.trim()) return;
    const visibility = isInterface ? 'public' : method.visibility === '#' ? 'protected' : method.visibility === '-' ? 'private' : 'public';
    const returnType = method.returnType.trim() || 'void';
    const parameters = method.parameters?.trim() || '';
    if (isInterface) {
      lines.push(`    ${visibility} ${returnType} ${safeJavaIdentifier(method.name)}(${parameters});`);
    } else {
      lines.push(`    ${visibility} ${returnType} ${safeJavaIdentifier(method.name)}(${parameters}) {`);
      lines.push('        throw new UnsupportedOperationException("TODO: implement");');
      lines.push('    }');
    }
    if (index < classItem.methods.length - 1) lines.push('');
  });

  return `${lines.join('\n')}\n}\n`;
}

function downloadText(filename, content) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/x-java-source;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ClassCard({ item, onEdit, onDelete, onPointerDown }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const stereotype = item.stereotype || 'class';

  return (
    <article
      className="uml-card"
      style={{ left: item.x, top: item.y }}
      onPointerDown={(event) => onPointerDown(event, item.id)}
      aria-label={`${item.name} UML class`}
    >
      <header className="class-header">
        <div className={`class-symbol ${stereotype}`} aria-hidden="true">
          {stereotype === 'interface' ? 'I' : stereotype === 'abstract' ? 'A' : 'C'}
        </div>
        <div className="class-heading">
          {stereotype !== 'class' && <div className="stereotype-label">«{stereotype}»</div>}
          <h3>{item.name}</h3>
        </div>
        <div className="card-actions">
          <button className="icon-button card-edit" onPointerDown={(event) => event.stopPropagation()} onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}>
            <Icon name="edit" size={15} />
          </button>
          <button className="icon-button card-menu" onPointerDown={(event) => event.stopPropagation()} onClick={() => setMenuOpen(!menuOpen)} aria-label={`More options for ${item.name}`}>
            <Icon name="dots" size={17} />
          </button>
          {menuOpen && (
            <div className="card-menu-popover">
              <button onClick={() => { onEdit(item); setMenuOpen(false); }}><Icon name="edit" size={15} /> Edit class</button>
              <button className="danger-action" onClick={() => { onDelete(item.id); setMenuOpen(false); }}><Icon name="trash" size={15} /> Delete class</button>
            </div>
          )}
        </div>
      </header>
      <section className="class-section">
        {item.attributes.length ? item.attributes.map((attribute) => (
          <div className="member-row" key={attribute.id}>
            <span className={`visibility ${attribute.visibility === '+' ? 'public' : attribute.visibility === '#' ? 'protected' : 'private'}`}>{attribute.visibility}</span>
            <span className="member-name">{attribute.name}</span><span className="member-type">{attribute.type}</span>
          </div>
        )) : <div className="empty-members">No attributes</div>}
      </section>
      <section className="class-section method-section">
        {item.methods.length ? item.methods.map((method) => (
          <div className="member-row" key={method.id}>
            <span className={`visibility ${method.visibility === '+' ? 'public' : method.visibility === '#' ? 'protected' : 'private'}`}>{method.visibility}</span>
            <span className="member-name">{method.name}({method.parameters || ''})</span><span className="member-type">: {method.returnType}</span>
          </div>
        )) : <div className="empty-members">No methods</div>}
      </section>
    </article>
  );
}

function ClassModal({ initialClass, onClose, onSave }) {
  const [name, setName] = useState(initialClass?.name || '');
  const [stereotype, setStereotype] = useState(initialClass?.stereotype || 'class');
  const [attributes, setAttributes] = useState(initialClass?.attributes || []);
  const [methods, setMethods] = useState(initialClass?.methods || []);

  const addAttribute = () => setAttributes([...attributes, { id: makeId('attr'), visibility: '-', name: '', type: 'String' }]);
  const addMethod = () => setMethods([...methods, { id: makeId('method'), visibility: '+', name: '', returnType: 'void', parameters: '' }]);
  const updateMember = (collection, setCollection, id, key, value) => {
    setCollection(collection.map((member) => member.id === id ? { ...member, [key]: value } : member));
  };
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...(initialClass || {}),
      id: initialClass?.id || makeId('class'),
      name: name.trim(),
      stereotype,
      x: initialClass?.x ?? 270,
      y: initialClass?.y ?? 160,
      attributes: attributes.filter((item) => item.name.trim()).map((item) => ({ ...item, name: item.name.trim(), type: item.type.trim() || 'Object' })),
      methods: methods.filter((item) => item.name.trim()).map((item) => ({ ...item, name: item.name.trim(), returnType: item.returnType.trim() || 'void' })),
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="editor-modal" onSubmit={submit}>
        <div className="modal-heading">
          <div><span className="eyebrow">{initialClass ? 'CLASS EDITOR' : 'NEW ELEMENT'}</span><h2>{initialClass ? 'Edit class' : 'Add a class'}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>
        </div>
        <div className="modal-scroll">
          <div className="form-grid">
            <label className="field-label">Class name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Customer" required /></label>
            <label className="field-label">Type<select value={stereotype} onChange={(event) => setStereotype(event.target.value)}><option value="class">Class</option><option value="abstract">Abstract class</option><option value="interface">Interface</option><option value="entity">Entity</option></select></label>
          </div>
          <div className="member-editor">
            <div className="section-heading"><div><h3>Attributes</h3><p>Properties that belong to this class</p></div><button type="button" className="small-outline-button" onClick={addAttribute}><Icon name="plus" size={15} /> Add</button></div>
            {attributes.length ? attributes.map((attribute) => (
              <div className="editable-member" key={attribute.id}>
                <select aria-label="Attribute visibility" value={attribute.visibility} onChange={(event) => updateMember(attributes, setAttributes, attribute.id, 'visibility', event.target.value)}><option value="+">+</option><option value="-">−</option><option value="#">#</option></select>
                <input aria-label="Attribute name" placeholder="name" value={attribute.name} onChange={(event) => updateMember(attributes, setAttributes, attribute.id, 'name', event.target.value)} />
                <input aria-label="Attribute type" placeholder="Type" value={attribute.type} onChange={(event) => updateMember(attributes, setAttributes, attribute.id, 'type', event.target.value)} />
                <button type="button" className="icon-button remove-member" onClick={() => setAttributes(attributes.filter((item) => item.id !== attribute.id))} aria-label="Remove attribute"><Icon name="close" size={15} /></button>
              </div>
            )) : <div className="editor-empty">No attributes yet. Add a property to get started.</div>}
          </div>
          <div className="member-editor">
            <div className="section-heading"><div><h3>Methods</h3><p>Actions this class can perform</p></div><button type="button" className="small-outline-button" onClick={addMethod}><Icon name="plus" size={15} /> Add</button></div>
            {methods.length ? methods.map((method) => (
              <div className="editable-member method-edit" key={method.id}>
                <select aria-label="Method visibility" value={method.visibility} onChange={(event) => updateMember(methods, setMethods, method.id, 'visibility', event.target.value)}><option value="+">+</option><option value="-">−</option><option value="#">#</option></select>
                <input aria-label="Method name" placeholder="methodName" value={method.name} onChange={(event) => updateMember(methods, setMethods, method.id, 'name', event.target.value)} />
                <input aria-label="Return type" placeholder="Return type" value={method.returnType} onChange={(event) => updateMember(methods, setMethods, method.id, 'returnType', event.target.value)} />
                <input aria-label="Method parameters" placeholder="Parameters (optional)" value={method.parameters || ''} onChange={(event) => updateMember(methods, setMethods, method.id, 'parameters', event.target.value)} />
                <button type="button" className="icon-button remove-member" onClick={() => setMethods(methods.filter((item) => item.id !== method.id))} aria-label="Remove method"><Icon name="close" size={15} /></button>
              </div>
            )) : <div className="editor-empty">No methods yet. Add a behavior to get started.</div>}
          </div>
        </div>
        <div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Icon name="check" size={16} /> {initialClass ? 'Save changes' : 'Add class'}</button></div>
      </form>
    </div>
  );
}

function RelationshipModal({ classes, relationships, onClose, onSave, onDelete }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [from, setFrom] = useState(classes[0]?.id || '');
  const [to, setTo] = useState(classes[1]?.id || '');
  const [type, setType] = useState('association');
  const [label, setLabel] = useState('');
  const className = (id) => classes.find((item) => item.id === id)?.name || 'Unknown class';

  const beginNew = () => {
    setFrom(classes[0]?.id || '');
    setTo(classes[1]?.id || '');
    setType('association');
    setLabel('');
    setEditId(null);
    setFormOpen(true);
  };

  const beginEdit = (relationship) => {
    setFrom(relationship.from);
    setTo(relationship.to);
    setType(relationship.type);
    setLabel(relationship.label);
    setEditId(relationship.id);
    setFormOpen(true);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!from || !to || from === to) return;
    onSave({ id: editId || makeId('rel'), from, to, type, label: label.trim() });
    setFormOpen(false);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="editor-modal relationship-modal">
        <div className="modal-heading"><div><span className="eyebrow">CONNECT CLASSES</span><h2>{formOpen ? (editId ? 'Edit relationship' : 'New relationship') : 'Relationships'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></div>
        {formOpen ? <>
          <form className="modal-scroll relationship-form" onSubmit={submit}>
            <label className="field-label">Relationship type
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="association">Association — uses or contains</option>
                <option value="inheritance">Inheritance — extends</option>
                <option value="dependency">Dependency — depends on</option>
              </select>
            </label>
            <div className="relationship-fields">
              <label className="field-label">From<select value={from} onChange={(event) => setFrom(event.target.value)}>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <span className="relationship-arrow">→</span>
              <label className="field-label">To<select value={to} onChange={(event) => setTo(event.target.value)}>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </div>
            <label className="field-label">Label <span className="optional-label">Optional</span><input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={type === 'association' ? 'e.g. owns, contains' : 'Add a note'} /></label>
            {from === to && <p className="form-error">Choose two different classes to connect.</p>}
          </form>
          <div className="modal-footer"><button type="button" className="secondary-button" onClick={() => setFormOpen(false)}>Back</button><button className="primary-button" type="button" onClick={submit}><Icon name="check" size={16} /> {editId ? 'Save changes' : 'Add relationship'}</button></div>
        </> : <>
          <div className="modal-scroll relationship-list">
            {relationships.length ? relationships.map((relationship) => (
              <div className="relationship-item" key={relationship.id}>
                <div className={`relationship-type-mark ${relationship.type}`}><Icon name="link" size={15} /></div>
                <div className="relationship-item-copy"><strong>{className(relationship.from)} <span>→</span> {className(relationship.to)}</strong><span>{relationship.type}{relationship.label ? ` · ${relationship.label}` : ''}</span></div>
                <button className="icon-button" onClick={() => beginEdit(relationship)} aria-label="Edit relationship"><Icon name="edit" size={15} /></button>
                <button className="icon-button relationship-delete" onClick={() => onDelete(relationship.id)} aria-label="Delete relationship"><Icon name="trash" size={15} /></button>
              </div>
            )) : <div className="relationship-list-empty"><div className="empty-icon"><Icon name="link" size={22} /></div><strong>No relationships yet</strong><span>Connect two classes to describe how they work together.</span></div>}
          </div>
          {classes.length < 2 && <p className="relationship-notice">Add at least two classes before creating a relationship.</p>}
          <div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Close</button><button className="primary-button" disabled={classes.length < 2} onClick={beginNew}><Icon name="plus" size={16} /> Add relationship</button></div>
        </>}
      </div>
    </div>
  );
}

function CodePanel({ classes, relationships, onClose }) {
  const sourceByClass = useMemo(() => classes.map((classItem) => ({
    name: safeJavaName(classItem.name),
    code: generateJava(classItem, relationships.map((relationship) => ({
      ...relationship,
      toClassName: classes.find((item) => item.id === relationship.to)?.name || 'Object',
      toStereotype: classes.find((item) => item.id === relationship.to)?.stereotype || 'class',
    }))),
  })), [classes, relationships]);
  const [selected, setSelected] = useState(sourceByClass[0]?.name || '');
  const [copied, setCopied] = useState(false);
  const activeSource = sourceByClass.find((source) => source.name === selected) || sourceByClass[0];

  useEffect(() => {
    if (!sourceByClass.some((source) => source.name === selected)) setSelected(sourceByClass[0]?.name || '');
  }, [sourceByClass, selected]);

  const copyCode = async () => {
    if (!activeSource) return;
    try {
      await navigator.clipboard.writeText(activeSource.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = activeSource.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <aside className="code-panel">
      <div className="code-panel-header"><div><span className="eyebrow">JAVA GENERATOR</span><h2>Your source code</h2><p>Generated from your class diagram</p></div><button className="icon-button" onClick={onClose} aria-label="Close code panel"><Icon name="close" /></button></div>
      {sourceByClass.length ? <>
        <div className="code-tabs">{sourceByClass.map((source) => <button key={source.name} className={selected === source.name ? 'active' : ''} onClick={() => setSelected(source.name)}>{source.name}.java</button>)}</div>
        <div className="code-toolbar"><span><span className="status-dot" /> Java</span><div><button className="small-outline-button" onClick={copyCode}><Icon name={copied ? 'check' : 'copy'} size={15} /> {copied ? 'Copied!' : 'Copy'}</button><button className="small-outline-button" disabled={!activeSource} onClick={() => activeSource && downloadText(`${activeSource.name}.java`, activeSource.code)}><Icon name="download" size={15} /> Download</button></div></div>
        <pre className="code-block"><code>{activeSource?.code}</code></pre>
      </> : <div className="code-empty"><div className="empty-icon"><Icon name="code" size={24} /></div><h3>Nothing to generate yet</h3><p>Add a class to see its Java source here.</p></div>}
      <div className="code-footnote"><Icon name="sparkle" size={16} /><span>Every class becomes a ready-to-extend <code>.java</code> file.</span></div>
    </aside>
  );
}

function RelationshipLines({ classes, relationships }) {
  const classMap = new Map(classes.map((item) => [item.id, item]));
  const classHeight = (item) => 86 + Math.max(item.attributes.length, 1) * 27 + 19 + Math.max(item.methods.length, 1) * 27;

  return (
    <svg className="relationship-layer" width="1120" height="760" viewBox="0 0 1120 760" aria-label="Class relationships">
      <defs>
        <marker id="association-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 8 5 1 9" fill="none" stroke="#858ba1" strokeWidth="1.3" /></marker>
        <marker id="dependency-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 8 5 1 9" fill="none" stroke="#858ba1" strokeWidth="1.3" /></marker>
        <marker id="inheritance-arrow" markerWidth="13" markerHeight="12" refX="11" refY="6" orient="auto"><path d="M1 1 11 6 1 11Z" fill="#fff" stroke="#858ba1" strokeWidth="1.2" /></marker>
      </defs>
      {relationships.map((relationship) => {
        const from = classMap.get(relationship.from);
        const to = classMap.get(relationship.to);
        if (!from || !to) return null;
        const startX = from.x + 126;
        const startY = from.y + classHeight(from) / 2;
        const endX = to.x + 126;
        const endY = to.y + classHeight(to) / 2;
        const marker = relationship.type === 'inheritance' ? 'inheritance-arrow' : relationship.type === 'dependency' ? 'dependency-arrow' : 'association-arrow';
        const path = `M ${startX} ${startY} L ${endX} ${endY}`;
        return (
          <g key={relationship.id} className="relationship-line">
            <path d={path} fill="none" stroke="#969caf" strokeWidth="1.55" strokeDasharray={relationship.type === 'dependency' ? '6 5' : undefined} markerEnd={`url(#${marker})`} />
            {relationship.label && <g><rect x={(startX + endX) / 2 - relationship.label.length * 3.4 - 8} y={(startY + endY) / 2 - 13} width={relationship.label.length * 6.8 + 16} height="23" rx="7" fill="#fff" stroke="#e6e8ef" /><text x={(startX + endX) / 2} y={(startY + endY) / 2 + 3} textAnchor="middle" fill="#646c82" fontSize="11" fontFamily="Inter, sans-serif">{relationship.label}</text></g>}
            <title>{`${from.name} ${relationship.type} ${to.name}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

export default function App() {
  const [classes, setClasses] = useState(() => readSaved('classcraft-classes', starterClasses));
  const [relationships, setRelationships] = useState(() => readSaved('classcraft-relationships', starterRelationships));
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [toast, setToast] = useState('');
  const [activeNav, setActiveNav] = useState('diagram');
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const scale = zoom / 100;
  const [viewportWidth, setViewportWidth] = useState(1120);
  const fitScale = Math.max(0.7, Math.min(1, viewportWidth / 1120));

  useEffect(() => {
    localStorage.setItem('classcraft-classes', JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem('classcraft-relationships', JSON.stringify(relationships));
  }, [relationships]);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }, []);

  const saveClass = (item) => {
    const isNew = !classes.some((existing) => existing.id === item.id);
    const nextItem = isNew ? { ...item, ...findOpenPosition(classes) } : item;
    setClasses((current) => current.some((existing) => existing.id === item.id)
      ? current.map((existing) => existing.id === item.id ? item : existing)
      : [...current, nextItem]);
    setShowClassModal(false);
    setSelectedClass(null);
    notify(isNew ? 'Class added to your diagram' : 'Class updated');
  };

  const deleteClass = (id) => {
    setClasses((current) => current.filter((item) => item.id !== id));
    setRelationships((current) => current.filter((relationship) => relationship.from !== id && relationship.to !== id));
    notify('Class and its relationships removed');
  };

  const startDrag = (event, id) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    event.preventDefault();
    const item = classes.find((classItem) => classItem.id === id);
    if (!item) return;
    dragRef.current = { id, startX: event.clientX, startY: event.clientY, x: item.x, y: item.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveClass = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    setClasses((current) => current.map((item) => item.id === drag.id
      ? { ...item, x: Math.max(12, Math.min(850, drag.x + (event.clientX - drag.startX) / (scale * fitScale))), y: Math.max(12, Math.min(630, drag.y + (event.clientY - drag.startY) / (scale * fitScale))) }
      : item));
  };

  const finishDrag = () => { dragRef.current = null; };

  const saveRelationship = (item) => {
    setRelationships((current) => current.some((relationship) => relationship.id === item.id)
      ? current.map((relationship) => relationship.id === item.id ? item : relationship)
      : [...current, item]);
    notify(relationships.some((relationship) => relationship.id === item.id) ? 'Relationship updated' : 'Relationship added to your diagram');
  };

  const deleteRelationship = (id) => {
    setRelationships((current) => current.filter((relationship) => relationship.id !== id));
    notify('Relationship removed');
  };

  const openAddClass = () => {
    setSelectedClass(null);
    setShowClassModal(true);
  };
  const classCountLabel = `${classes.length} ${classes.length === 1 ? 'class' : 'classes'}`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#diagram" onClick={(event) => event.preventDefault()}><span className="brand-mark"><Icon name="grid" size={19} /></span><span>classcraft<span className="brand-dot">.</span><small>UML STUDIO</small></span></a>
        <div className="workspace-switcher"><div className="workspace-avatar">S</div><div className="workspace-meta"><strong>Student workspace</strong><span>Personal plan</span></div><Icon name="down" size={15} /></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeNav === 'diagram' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav('diagram')}><Icon name="grid" size={18} /><span>Class diagram</span><span className="nav-count">{classes.length}</span></button>
          <button className={activeNav === 'code' ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveNav('code'); setShowCode(true); }}><Icon name="code" size={18} /><span>Java source</span><Icon name="chevron" size={15} className="nav-chevron" /></button>
          <button className={activeNav === 'relationships' ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveNav('relationships'); setShowRelationshipModal(true); }}><Icon name="link" size={18} /><span>Relationships</span><span className="nav-count">{relationships.length}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-sparkle"><Icon name="sparkle" size={16} /></div><strong>Diagram tip</strong><p>Drag a class to arrange your canvas. Double-check your relationships before generating code.</p><button onClick={() => notify('Select “Add relationship” to connect any two classes.')}>Learn the basics <Icon name="chevron" size={13} /></button></div>
          <button className="nav-item settings-item" onClick={() => notify('Your diagram saves automatically in this browser.')}><Icon name="settings" size={18} /><span>Settings</span></button>
          <div className="profile-row"><div className="profile-avatar">S</div><div><strong>Student</strong><span>Free workspace</span></div><button className="icon-button" aria-label="Profile options" onClick={() => notify('You are using a local student workspace.')}><Icon name="dots" size={18} /></button></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>My projects</span><Icon name="chevron" size={14} /><strong>Online Store</strong><span className="save-state"><span className="save-dot" /> Saved</span></div>
          <div className="topbar-actions"><button className="avatar-stack" aria-label="Collaborators"><span>S</span><span>+1</span></button><button className="share-button" onClick={() => notify('Your project is ready to share from this browser.')}>Share</button><button className="top-icon-button" onClick={() => notify('All changes are saved automatically.')} aria-label="More project options"><Icon name="dots" /></button></div>
        </header>

        <section className="project-heading">
          <div className="heading-copy"><div className="project-eyebrow"><span className="project-mark"><Icon name="grid" size={13} /></span> CLASS DIAGRAM <span className="heading-dot">·</span> UPDATED JUST NOW</div><h1>Online Store <button aria-label="Rename project" className="heading-edit" onClick={() => notify('Project title: Online Store')}><Icon name="edit" size={16} /></button></h1><p>Model your classes, define relationships, and generate Java code.</p></div>
          <div className="heading-actions"><button className="secondary-button relationship-action" onClick={() => { setActiveNav('relationships'); setShowRelationshipModal(true); }}><Icon name="link" size={16} /> Relationship</button><button className="primary-button" onClick={openAddClass}><Icon name="plus" size={17} /> Add class</button></div>
        </section>

        <section className="diagram-workspace">
          <div className="diagram-toolbar">
            <div className="diagram-context"><span className="diagram-context-mark"><Icon name="cursor" size={15} /></span><div><strong>Diagram canvas</strong><span>{classCountLabel}<span className="context-separator">·</span>{relationships.length} {relationships.length === 1 ? 'relationship' : 'relationships'}</span></div></div>
            <div className="canvas-tools">
              <div className="zoom-control"><button className="icon-button" aria-label="Zoom out" onClick={() => setZoom((current) => Math.max(60, current - 10))}><Icon name="zoomOut" size={17} /></button><span>{zoom}%</span><button className="icon-button" aria-label="Zoom in" onClick={() => setZoom((current) => Math.min(130, current + 10))}><Icon name="zoomIn" size={17} /></button></div>
              <button className="icon-button toolbar-more" aria-label="Remove all relationships" title="Remove all relationships" onClick={() => { if (relationships.length) { setRelationships([]); notify('All relationships removed'); } }}><Icon name="dots" size={18} /></button>
            </div>
          </div>
          <div className="canvas-viewport" ref={viewportRef}>
            {classes.length ? (
              <div className="canvas-stage" style={{ width: 1120 * scale * fitScale, height: 760 * scale * fitScale }} onPointerMove={moveClass} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
                <div className="canvas-scaled" style={{ width: 1120, height: 760, transform: `scale(${scale * fitScale})` }}>
                  <RelationshipLines classes={classes} relationships={relationships} />
                  {classes.map((item) => <ClassCard key={item.id} item={item} onEdit={(classItem) => { setSelectedClass(classItem); setShowClassModal(true); }} onDelete={deleteClass} onPointerDown={startDrag} />)}
                </div>
              </div>
            ) : <div className="canvas-empty"><div className="empty-icon"><Icon name="grid" size={26} /></div><h2>Your canvas is ready</h2><p>Add your first class to start designing a UML class diagram.</p><button className="primary-button" onClick={openAddClass}><Icon name="plus" size={17} /> Add your first class</button></div>}
            <div className="canvas-hint"><span className="hint-icon"><Icon name="cursor" size={13} /></span> Drag classes to arrange</div>
          </div>
          <footer className="diagram-footer"><div><span className="footer-indicator" /> All changes saved locally</div><button onClick={() => { setShowCode(true); setActiveNav('code'); }}><Icon name="code" size={15} /> Generate Java <Icon name="chevron" size={14} /></button></footer>
        </section>
      </main>

      {showCode && <CodePanel classes={classes} relationships={relationships} onClose={() => { setShowCode(false); setActiveNav('diagram'); }} />}
      {showClassModal && <ClassModal initialClass={selectedClass} onClose={() => { setShowClassModal(false); setSelectedClass(null); }} onSave={saveClass} />}
      {showRelationshipModal && <RelationshipModal classes={classes} relationships={relationships} onClose={() => { setShowRelationshipModal(false); setActiveNav('diagram'); }} onSave={saveRelationship} onDelete={deleteRelationship} />}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={13} /></span>{toast}</div>}
    </div>
  );
}
