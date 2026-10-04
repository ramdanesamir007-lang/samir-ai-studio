const tokenInput = document.getElementById('token');
const genButton = document.getElementById('genimg');
const promptInput = document.getElementById('prompt');
const modelSelect = document.getElementById('model');
const output = document.getElementById('imgout');

genButton.addEventListener('click', generateImage);

const vidButton = document.getElementById('genvid');
const vidoutput = document.getElementById('vidout');
vidButton.addEventListener('click', generateVideo);

async function generateVideo(){
  const token = tokenInput.value.trim();
  const prompt = document.getElementById('vidprompt').value.trim();
  const model = document.getElementById('vidmodel').value;
  if(!token){ vidoutput.textContent = 'Please enter your Hugging Face API token first.'; return; }
  if(!prompt){ vidoutput.textContent = 'Please enter a prompt first.'; return; }
  vidoutput.textContent = 'Generating video... (free inference can take 30-90s)';
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt })
    });
    if(!res.ok){
      const text = await res.text();
      vidoutput.textContent = 'Error: ' + res.status + '. ' + (text.slice(0,250) || 'Check your token/model.'); return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    vidoutput.innerHTML = '<video controls autoplay loop src="'+url+'" style="max-width:100%;border-radius:10px"></video>';
  } catch(e){
    vidoutput.textContent = 'Error: ' + e.message;
  }
}

async function generateImage(){
  const token = tokenInput.value.trim();
  const prompt = promptInput.value.trim();
  const model = modelSelect.value;
  if(!token){ output.textContent = 'Please enter your Hugging Face API token first.'; return; }
  if(!prompt){ output.textContent = 'Please enter a prompt first.'; return; }
  output.textContent = 'Generating... (this may take 20-60 seconds)';
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt })
    });
    if(!res.ok){
      const text = await res.text();
      output.textContent = 'Error: ' + res.status + '. ' + (text.slice(0,200) || 'Check your token/model.') ;
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    output.innerHTML = '<img src="'+url+'" alt="Generated image">';
  } catch(e){
    output.textContent = 'Error: ' + e.message;
  }
}

// File add via thumbnails
document.getElementById('thumb').addEventListener('click', () => document.getElementById('filevid').click());
document.getElementById('filevid').addEventListener('change', (e) => {
  const f = e.target.files[0];
  const d = document.getElementById('vidupload');
  const thumb = document.getElementById('thumb');
  const out = document.getElementById('vidout');
  if (!f) { d.textContent = ''; return; }
  d.textContent = `Selected: ${f.name}`;
  if (f.type.startsWith('image/')) { thumb.innerHTML = '<img src="'+URL.createObjectURL(f)+'" style="width:100%;height:100%;object-fit:cover;border-radius:10px">'; out.innerHTML=''; }
  else if (f.type.startsWith('video/')) { thumb.innerHTML = '<span style="font-size:20px">▶</span>'; out.innerHTML = '<video controls src="'+URL.createObjectURL(f)+'" style="max-width:100%;border-radius:10px"></video>'; }
  else { thumb.innerHTML = '!'; out.textContent = 'Unsupported file: ' + f.name; }
});
document.getElementById('ithumb').addEventListener('click', () => document.getElementById('fileimg').click());
document.getElementById('fileimg').addEventListener('change', (e) => {
  const f = e.target.files[0];
  const d = document.getElementById('imgupload');
  const thumb = document.getElementById('ithumb');
  const out = document.getElementById('imgout');
  if (!f) { d.textContent = ''; return; }
  d.textContent = `Selected: ${f.name}`;
  if (f.type.startsWith('image/')) {
    thumb.innerHTML = '<img src="'+URL.createObjectURL(f)+'" style="width:100%;height:100%;object-fit:cover;border-radius:10px">';
  } else { out.textContent = 'Selected file is not an image: ' + f.name; }
});
