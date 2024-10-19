$(() => {
  $('#btnModalPost').click(() => {
    $('#tituloNewPost').val('')
    $('#descripcionNewPost').val('')
    $('#linkVideoNewPost').val('')
    $('#btnUploadFile').val('')
    $('.determinate').attr('style', `width: 0%`)
    sessionStorage.setItem('imgNewPost', null)

    // TODO: Validar que el usuario esta autenticado

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    $('#modalPost').modal('open')
  })

  $(() => {
    // ... otros códigos ...

    $(document).on('click', '.btnEliminarPost', function () {
      const postId = $(this).data('id');
      const post = new Post();
      post.eliminarPost(postId);
    });
  });



  $('#btnRegistroPost').click(function (event) {
    const post = new Post();

    event.preventDefault();

    const titulo = $('#tituloNewPost').val();
    const descripcion = $('#descripcionNewPost').val();
    const imagenFile = $('#btnUploadFile').prop('files')[0];
    const excelFile = $('#btnUploadExcel').prop('files')[0];
    const videoLink = $('#linkVideoNewPost').val();
    const user = firebase.auth().currentUser;

    if (user) {
      post.crearPost(user.uid, user.email, titulo, descripcion, imagenFile, excelFile, videoLink)
        .then(() => {
          $('#modalPost').modal('close');
          $('#formCrearPost')[0].reset();
        })
        .catch(error => {
          console.error(`Error creando el post => ${error}`);
        });
    } else {
      console.error('No hay usuario autenticado');
    }
  });

  $('#btnUploadFile').on('change', e => {
    // TODO: Validar que el usuario esta autenticado

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    const file = e.target.files[0]

    // TODO: Referencia al storage

  })
})
