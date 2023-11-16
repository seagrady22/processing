class Complex {
	constructor(re=0,im=0) {
		this.re = re;
		this.im = im;
	}
	printSelf() {
		print(String(this.re)+" + "+String(this.im)+"i");
	}
	toString() {
		return(String(round(this.re,2))+" "+(this.im<0?"-":"+")+" "+String(round(abs(this.im),2))+"i");
	}
	static mult(c1,c2=-1) {
		if (c2===-1) {
			let prod = new Complex(1,0);
			for (let c of c1) {
				prod = new Complex(prod.re*c.re-prod.im*c.im,
											prod.re*c.im+prod.im*c.re);
			}
			return prod;
		}
		return new Complex(c1.re*c2.re-c1.im*c2.im,
											c1.re*c2.im+c1.im*c2.re);
	}
	static div(c1,c2) {
		let d = c2.re**2+c2.im**2;
		if (d==0) return new Complex(0,0);
		return new Complex((c1.re*c2.re+c1.im*c2.im)/d,
											(c2.re*c1.im-c2.im*c1.re)/d);
	}
	mag() {
		return new Complex(sqrt(this.re**2+this.im**2),0);
	}
	static abs(c) {
		return new Complex(abs(c.re),c.im);
	}
	static ONE() {return new Complex(1,0)}
	static TWO() {return new Complex(2,0)}
	static ONE_HALF() {return new Complex(0.5,0)}
	static MINUS_ONE() {return new Complex(-1,0)}
	static I() {return new Complex(0,1)}
	static MINUS_I() {return new Complex(0,-1)}
	static ZERO() {return new Complex(0,0)}
	static pow(c,exp) {
		let c_copy = c.copy();
		for (let i=0;i<exp-1;i++) {
			c_copy = Complex.mult(c_copy,c);
		}
		return c_copy;
	}
	copy() {
		return new Complex(this.re,this.im)
	}
	static add(c1,c2=-1) {
		if (c2===-1) {
			let sum = new Complex(0,0);
			for (let c of c1) {
				sum.re+=c.re;
				sum.im+=c.im;
			}
			return sum;
		}
		return new Complex(c1.re+c2.re,c1.im+c2.im);
	}
	static addnums(c,n1,n2) {
		return new Complex(c.re+n1,c.im+n2);
	}
	
	static sub(c1,c2=-1) {
		if (c2===-1) {
			let sum = new Complex(c1[0].re,c1[0].im);
			for (let c in c1) {
				if (c=="0") continue;
				sum.re-=c.re;
				sum.im-=c.im;
			}
			return sum;
		}
		return new Complex(c1.re-c2.re,c1.im-c2.im);
	}
	static multnums(c,n1,n2=0) {
		return new Complex(c.re*n1-c.im*n2,
											c.re*n2+c.im*n1);
	}
	static sin(c) {
		if (c.re>PI&&c.re<=TAU) return Complex.multnums(Complex.sin(Complex.addnums(c,-PI,0)),-1,0);
		if (c.re>TAU) return Complex.sin(new Complex(c.re%TAU,c.im));
		if (c.re<-PI&&c.re>=-TAU) return Complex.multnums(Complex.sin(Complex.addnums(c,PI,0)),-1,0);
		if (c.re<-TAU) return Complex.sin(new Complex(c.re%TAU,c.im));
		return Complex.add([c,Complex.div(Complex.pow(c,3),new Complex(-6,0)),
											 Complex.div(Complex.pow(c,5),new Complex(120,0)),
											 Complex.div(Complex.pow(c,7),new Complex(-5040,0)),
											 Complex.div(Complex.pow(c,9),new Complex(362880,0)),
											 Complex.div(Complex.pow(c,11),new Complex(-3628800*11,0)),
											]);
	}
	static cos(c) {
		if (c.re>PI&&c.re<=TAU) return Complex.multnums(Complex.cos(Complex.addnums(c,-PI,0)),-1,0);
		if (c.re>TAU) return Complex.cos(new Complex(c.re%TAU,c.im));
		if (c.re<-PI&&c.re>=-TAU) return Complex.multnums(Complex.cos(Complex.addnums(c,PI,0)),-1,0);
		if (c.re<-TAU) return Complex.cos(new Complex(c.re%TAU,c.im));
		return Complex.add([Complex.ONE(),
												Complex.div(Complex.pow(c,2),new Complex(-2,0)),
												Complex.div(Complex.pow(c,4),new Complex(24,0)),
												Complex.div(Complex.pow(c,6),new Complex(-720,0)),
												Complex.div(Complex.pow(c,8),new Complex(40320,0)),
												Complex.div(Complex.pow(c,10),new Complex(-3628800,0)),
												Complex.div(Complex.pow(c,12),new Complex(-3628800*132,0)),
											]);
	}
	static exp(c) {
		return Complex.multnums(
			new Complex(cos(c.im),sin(c.im)),
			exp(c.re),0
		);
	}
	static sinh(c) {
		return Complex.multnums(Complex.sub(Complex.exp(c),Complex.exp(Complex.mult(c, Complex.MINUS_ONE()))), 0.5, 0);
	}
	static arctan(c) {
		return Complex.add([c,Complex.div(Complex.pow(c,3),new Complex(-3,0)),
											 Complex.div(Complex.pow(c,5),new Complex(5,0)),
											 Complex.div(Complex.pow(c,7),new Complex(-7,0)),
											 Complex.div(Complex.pow(c,9),new Complex(9,0)),
											 Complex.div(Complex.pow(c,11),new Complex(-11,0)),
											 Complex.div(Complex.pow(c,13),new Complex(13,0)),
											 Complex.div(Complex.pow(c,15),new Complex(-15,0)),
											 Complex.div(Complex.pow(c,17),new Complex(17,0)),
											 Complex.div(Complex.pow(c,19),new Complex(-19,0)),
											 Complex.div(Complex.pow(c,21),new Complex(21,0)),
											 Complex.div(Complex.pow(c,23),new Complex(-23,0)),
											 Complex.div(Complex.pow(c,25),new Complex(25,0)),
											 Complex.div(Complex.pow(c,27),new Complex(-27,0)),
											 Complex.div(Complex.pow(c,29),new Complex(29,0)),
											 Complex.div(Complex.pow(c,31),new Complex(-31,0)),
											 Complex.div(Complex.pow(c,33),new Complex(33,0)),
											 Complex.div(Complex.pow(c,35),new Complex(-35,0)),
											 Complex.div(Complex.pow(c,37),new Complex(37,0)),
											 Complex.div(Complex.pow(c,39),new Complex(-39,0)),
											 Complex.div(Complex.pow(c,41),new Complex(41,0)),
											 Complex.div(Complex.pow(c,43),new Complex(-43,0)),
											 Complex.div(Complex.pow(c,45),new Complex(45,0)),
											 Complex.div(Complex.pow(c,47),new Complex(-47,0)),
											 Complex.div(Complex.pow(c,49),new Complex(49,0)),
											]);
	}
	static cosh(c) {
		return Complex.multnums(Complex.add(Complex.exp(c),Complex.exp(Complex.mult(c, Complex.MINUS_ONE()))), 0.5, 0);
	}
	static zeta(c) {
		let sum = Complex.ZERO();
		if (c.re<=1) {
			if (c.re>=0) {
				let sum2 = Complex.ZERO();
				for (let n=1;n<41;n++) {
					sum2 = Complex.add(sum2, 
														 Complex.div(new Complex((-1)**(n+1),0), Complex.cPow(new Complex(n,0),c))
														);
				}
				return Complex.mult(sum2, Complex.div(Complex.ONE(),
																							Complex.sub(
					Complex.ONE(), Complex.cPow(new Complex(2,0), Complex.sub(Complex.ONE(),c))
				)
																						 ))
			}
			return Complex.mult([
				Complex.cPow(Complex.TWO(),c),
				Complex.cPow(new Complex(PI,0),Complex.add(c,Complex.MINUS_ONE())),
				Complex.sin(Complex.mult(c, new Complex(HALF_PI,0) )),
				Complex.gamma(Complex.sub(Complex.ONE(),c)),
				Complex.zeta(Complex.sub(Complex.ONE(),c)),
			]);
		}
		for (let n=1;n<100;n++) sum = Complex.add(sum,
																						 Complex.cPow(new Complex(1/n,0),c)
																						);
		return sum;
	}
	static tan(c) {
		return Complex.div(Complex.sin(c),Complex.cos(c));
	}
	static tanh(c) {
		return Complex.div(Complex.sinh(c),Complex.cosh(c));
	}
	static sec(c) {
		return Complex.div(Complex.ONE(),Complex.cos(c));
	}
	static csc(c) {
		return Complex.div(Complex.ONE(),Complex.sin(c));
	}
	static cot(c) {
		return Complex.div(Complex.cos(c),Complex.sin(c));
	}
	static sech(c) {
		return Complex.div(Complex.ONE(),Complex.cosh(c));
	}
	static csch(c) {
		return Complex.div(Complex.ONE(),Complex.sinh(c));
	}
	static coth(c) {
		return Complex.div(Complex.cosh(c),Complex.sinh(c));
	}
	static arg(c) {
		return new Complex(atan2(c.im,c.re),0);
	}
	static cis(c) {
		return Complex.add(Complex.cos(c),Complex.multnums(Complex.sin(c),0,1));
	}
	static sinc(c) {
		return Complex.div(Complex.sin(c),c);
	}
	static ln(c) {
		return new Complex(
			Math.log(c.mag().re),
			atan2(c.im,c.re),
		);
	}
	static gamma(c) {
		const dx = 0.05;
		let sum = Complex.ZERO();
		if (c.re<0){
			for (let x=-15;x<0;x+=dx) sum = Complex.add(sum,Complex.multnums( 
																						Complex.multnums( // multiply by e^-x
																							 Complex.cPow(new Complex(x,0), // x^c-1
																													Complex.add(c,Complex.MINUS_ONE()) // c-1
																						), exp(-x), 0),
																						dx,0) // multiply by dx
																						);
		} else {
			for (let x=dx;x<15;x+=dx) sum = Complex.add(sum,Complex.multnums( 
																						Complex.multnums( // multiply by e^-x
																							 Complex.cPow(new Complex(x,0), // x^c-1
																													Complex.add(c,Complex.MINUS_ONE()) // c-1
																						), exp(-x), 0),
																						dx,0) // multiply by dx
																						);
		}
		return c.re<0?Complex.multnums(sum,-1):sum;
	}
	static cPow(c1,c2) {
		if (c1.re===0&&c1.im===0) return Complex.ZERO();
		return Complex.exp(
			Complex.mult(Complex.ln(c1),c2)
		);
	}
	static sqrt(c) {
		return Complex.cPow(c,Complex.ONE_HALF());
	}
	static F_(c) {
		return Complex.multnums(Complex.sub(
						Complex.cPow(new Complex(PHI,0),c),
						Complex.cPow(new Complex((-1)/PHI,0),c),
					),
					1/sqrt(5),0);
	}
	renderPos() {
		return createVector(map(this.re,-XR,XR,0,width),map(this.im,-YR,YR,height,0));
	}
	static reverseRenderPos(x,y) {
		return new Complex(map(x,0,width,-XR,XR,),map(y,height,0,-YR,YR,));
	}
}
