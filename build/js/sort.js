let list = let contacts = [
    {
      name: "Alice Müller",
      email: "alice.mueller@example.com",
      number: "+49176235468",
    },
    {
      name: "Anton Müller",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Arne Müller",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Augst Müller",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Boran Schneider",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Felix Koch",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Charlotte Fischer",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "David Weber",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
    {
      name: "Eva Berger",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
  
    {
      name: "Bob Schneider",
      email: "bob.schneider@example.com",
      number: "+49176235468",
    },
  ];

  let puffer;


  function sorter() {
    for(let i=0; i< list.length-1; i++) {
        for(let j=i+1; j<list.length; j++) {
            if(list[i].name > list[j].name)  {
                puffer = list[j];
                list[i] = list[j];
                list[j] = puffer;
            }
        }
        console.log(list);
      }
  }