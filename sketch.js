// #!/usr/bin/env node

//var archy = require('archy')
//var MD = require('markdown-it')

var ui = `- office
  - stuff
  - more stuff
    - like chairs
    - or desks
    - or a filing cabinet
      - with papers...
      - ummm... business... papers
  - and extra stuff`


var out = {
  label: 'office',
  nodes: [
    { label: 'stuff', nodes: [] },
    {
      label: 'more stuff',
      nodes: [
        { label: 'like chairs', nodes: [] },
        { label: 'desks', nodes: [] },
        {
          label: 'or a filing cabinet',
          nodes: [
            { label: 'with papers...', nodes: [] },
            { label: 'ummm... business... papers', nodes: [] },
          ],
        },
      ],
    },
    { label: 'and extra stuff' },
  ],
}

//var md = new MD()
//var p = md.parse(ui)

// Below required 
//var t = p.filter(t => !/list_item|para/.test(t.type))
//  .map(t => ({
//    ...(/bullet_list_open/.test(t.type) ? { t: 'open' } : {}),
//    ...(/bullet_list_close/.test(t.type) ? { t: 'close' } : {}),
//    ...(t.content !== '' ? { label: t.content } : {}),
//  }))

var mdParsed = mock()

var idx = []
var tt = mdParsed.reduce((memo, step, i) => {
  if(i === 0) return memo
  if(Object.keys(memo).length === 0){
    console.log("set  root")
    memo = { ...memo, ...step }
  }
  else if(step.t === 'open' && idx.length === 0 && !memo.nodes){
    console.log("step in (first)")
    memo.nodes = []
    idx.push(0)
  }
  else if(step.t === 'close'){
    console.log("step out")
    idx.pop()
  }
  else if(step.label && idx.length === 1) {
    console.log("push root")
    memo.nodes.push(step)
    idx[idx.length -1]++
  }
  else if(step.t === 'open' && idx.length > 0) {
    console.log(i, "step in")
    var ref = idx.reduce((ref, ii) => {
      console.log("ref", ref, "ii", ii)
      if(!ref[ii]){
        return ref
      }
      return ref[ii]
    }, memo.nodes)
    console.log("ref"ref)
    ref.nodes = []
    idx.push(0)
    console.log("memo", memo)
    return memo
  }
  else if(step.label && idx.length > 1) {
    console.log("push leaf")
  //  console.log("idx", idx, "i", i, "memo", memo)
    var ref = idx.reduce((ref, ii) => {
  //    console.log("ref", ref, "ii", ii)
      return ref[ii].nodes
    }, memo.nodes)
    ref.push(step)
    idx[idx.length -1]++
    return memo
  }
  //console.log(i+":", t[i],  memo)
  return memo
}, {})
//console.log(t)
//console.dir(tt, { depth: 5 })
//console.dir(o, { depth: 5 })
process.exit()



//console.log(ui)
//console.log(archy(o))
function mock(){
  return JSON.parse('[{"t":"open"},{"label":"office"},{"t":"open"},{"label":"stuff"},{"label":"more stuff"},{"t":"open"},{"label":"like chairs"},{"label":"or desks"},{"label":"or a filing cabinet"},{"t":"open"},{"label":"with papers..."},{"label":"ummm... business... papers"},{"t":"close"},{"t":"close"},{"label":"and extra stuff"},{"t":"close"},{"t":"close"}]')
}
