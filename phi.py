import decimal;
from decimal import Decimal as dec
with decimal.localcontext() as ctx:
    ctx.prec = 5000000
    with open("phi.txt", "a") as f:
        f.write(str((dec(5).sqrt() + 1)/2))
    