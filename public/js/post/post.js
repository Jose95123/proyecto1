class Post {
    constructor() {
        // TODO inicializar firestore y settings

        this.db = firebase.firestore()
        this.storage = firebase.storage();

    }

    crearPost(uid, emailUser, titulo, descripcion, imagenFile, excelFile, videoLink) {
        const storageRef = this.storage.ref();

        const imagenRef = storageRef.child(`images/${imagenFile.name}`);
        const excelRef = storageRef.child(`excels/${excelFile.name}`);

        const uploadImagen = imagenRef.put(imagenFile).then(snapshot => snapshot.ref.getDownloadURL());

        const uploadExcel = excelRef.put(excelFile).then(snapshot => snapshot.ref.getDownloadURL());


        return Promise.all([uploadImagen, uploadExcel])
            .then(urls => {
                const [imagenLink, excelLink] = urls;

                return this.db.collection('posts').add({
                    uid: uid,
                    autor: emailUser,
                    titulo: titulo,
                    descripcion: descripcion,
                    imagenLink: imagenLink,
                    excelLink: excelLink,
                    videoLink: videoLink,
                    fecha: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(refDoc => {
                console.log(`Id del Post => ${refDoc.id}`);
            })
            .catch(error => {
                console.error(`Error creando el post => ${error}`);
            });
    }

    consultarTodosPost() {

        this.db.collection('posts').onSnapshot(querySnapshot => {
            $('#posts').empty()
            if (querySnapshot.empty) {
                $('#posts').append(this.obtenerTemplatePostVacio())
            } else {
                querySnapshot.forEach(post => {
                    const postData = post.data();
                    const fecha = postData.fecha.toDate(); 
                    const fechaFormateada = Utilidad.obtenerFecha(fecha); 
                    let postHtml = this.obtenerPostTemplate(
                        post.data().autor,
                        post.data().titulo,
                        post.data().descripcion,
                        post.data().videoLink,
                        post.data().imagenLink,
                        post.data().excelLink,                        
                        fechaFormateada,
                        post.id
                    )
                    $('#posts').append(postHtml)
                }
                )
            }
        }
        )
    }

    consultarPostxUsuario(emailUser) {

        this.db.collection('posts').where('autor', '==', emailUser).onSnapshot(querySnapshot => {
            $('#posts').empty()
            if (querySnapshot.empty) {
                $('#posts').append(this.obtenerTemplatePostVacio())
            } else {
                querySnapshot.forEach(post => {
                    const postData = post.data();
                    const fecha = postData.fecha.toDate(); 
                    const fechaFormateada = Utilidad.obtenerFecha(fecha); 
                    let postHtml = this.obtenerPostTemplate(
                        post.data().autor,
                        post.data().titulo,
                        post.data().descripcion,
                        post.data().videoLink,
                        post.data().imagenLink,
                        post.data().excelLink,                        
                        fechaFormateada,
                        post.id

                    )
                    $('#posts').append(postHtml)
                }
                )
            }
        }
        )

    }


    eliminarPost(postId) {
        return this.db.collection('posts').doc(postId).delete()
            .then(() => {
                console.log(`Post con ID ${postId} eliminado`);
                Materialize.toast(`Post eliminado correctamente`, 4000);
            })
            .catch(error => {
                console.error(`Error eliminando el post => ${error}`);
                Materialize.toast(`Error eliminando el post => ${error}`, 4000);
            });
    }


    obtenerTemplatePostVacio() {
        return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
    }

    obtenerPostTemplate(
        autor,
        titulo,
        descripcion,
        videoLink,
        imagenLink,
        excelLink,
        fecha,
        postId
    ) {
        const deleteButton = `<button class="btn red lighten-1 btnEliminarPost" data-id="${postId}">Eliminar</button>`;
        const downloadImagenButton = imagenLink ? `<a href="${imagenLink}" download class="btnDescargarImagen">Descargar Imagen</a>` : '';
        const downloadExcelButton = excelLink ? `<a href="${excelLink}" download class="btnDescargarExcel">Descargar Excel</a>` : '';

        if (imagenLink) {
            return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
                <div class="row">
                    <div class="col s12 m4">
                        ${deleteButton}
                    </div>
                    <div class="col s12 m4">
                        ${downloadImagenButton}
                    </div>
                    <div class="col s12 m4">
                        ${downloadExcelButton}
                    </div>
                </div>
            </div>
        </article>`
        }

        return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${videoLink}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                    <div class="row">
                    <div class="col s12 m4">
                        ${deleteButton}
                    </div>
                    <div class="col s12 m4">
                        ${downloadImagenButton}
                    </div>
                    <div class="col s12 m4">
                        ${downloadExcelButton}
                    </div>
                </div>
                </div>
            </article>`
    }
}
