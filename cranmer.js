#!/usr/bin/env bun
// Cranmer
// Little Anglican ✝️🏴󠁧󠁢󠁥󠁮󠁧󠁿 tool for printing the 39 Articles of Religion
// MIT License
// (c) 2026 by Softwave https://s0ftwave.net/
// Uses Bun, obviously you can just make it use node

const { styleText } = require('node:util');

// Wrap text
function wordWrap(text, width) {
    const cols = width || (process.stdout.columns ? process.stdout.columns - 2 : 78);
    return text.split('\n').map(line => {
        if (line.length <= cols) return line;
        const words = line.split(' ');
        const lines = [];
        let current = '';
        for (const word of words) {
            if ((current + ' ' + word).trimStart().length > cols) {
                if (current) lines.push(current);
                current = word;
            } else {
                current = current ? current + ' ' + word : word;
            }
        }
        if (current) lines.push(current);
        return lines.join('\n');
    }).join('\n');
}

const articles = {
    'I': "OF FAITH IN THE HOLY TRINITY.\nThere is but one living and true God, everlasting, without body, parts, or passions; of infinite power, wisdom, and goodness; the Maker, and Preserver of all things both visible and invisible. And in unity of this Godhead there be three Persons, of one substance, power, and eternity; the Father, the Son, and the Holy Ghost.",
    'II': "OF THE WORD OR SON OF GOD, WHICH WAS MADE VERY MAN.\nThe Son, which is the Word of the Father, begotten from everlasting of the Father, the very and eternal God, and of one substance with the Father, took Man's nature in the womb of the blessed Virgin, of her substance: so that two whole and perfect Natures, that is to say, the Godhead and Manhood, were joined together in one Person, never to be divided, whereof is one Christ, very God, and very Man; who truly suffered, was crucified, dead, and buried, to reconcile his Father to us, and to be a sacrifice, not only for original guilt, but also for actual sins of men.",
    'III': "OF THE GOING DOWN OF CHRIST INTO HELL.\nAs Christ died for us, and was buried, so also is it to be believed, that he went down into Hell.",
    'IV': "OF THE RESURRECTION OF CHRIST.\nChrist did truly rise again from death, and took again his body, with flesh, bones, and all things appertaining to the perfection of Man's nature; wherewith he ascended into Heaven, and there sitteth, until he return to judge all Men at the last day.",
    'V': "OF THE HOLY GHOST.\nThe Holy Ghost, proceeding from the Father and the Son, is of one substance, majesty, and glory, with the Father and the Son, very and eternal God.",
    'VI': "OF THE SUFFICIENCY OF THE HOLY SCRIPTURES FOR SALVATION.\nHoly Scripture containeth all things necessary to salvation: so that whatsoever is not read therein, nor may be proved thereby, is not to be required of any man, that it should be believed as an article of the Faith, or be thought requisite or necessary to salvation. In the name of the Holy Scripture we do understand those canonical Books of the Old and New Testament, of whose authority was never any doubt in the Church.\n\nOf the Names and Number of the Canonical Books.\nGenesis, The First Book of Samuel, The Book of Esther,\nExodus, The Second Book of Samuel, The Book of Job,\nLeviticus, The First Book of Kings, The Psalms,\nNumbers, The Second Book of Kings, The Proverbs,\nDeuteronomy, The First Book of Chronicles, Ecclesiastes or Preacher,\nJoshua, The Second Book of Chronicles, Cantica, or Songs of Solomon,\nJudges, The First Book of Esdras, Four Prophets the greater,\nRuth, The Second Book of Esdras, Twelve Prophets the less.\n\nAnd the other Books (as Hierome saith) the Church doth read for example of life and instruction of manners;\n but yet doth it not apply them to establish any doctrine; such are these following:\n\nThe Third Book of Esdras, The rest of the Book of Esther,\nThe Fourth Book of Esdras, The Book of Wisdom,\nThe Book of Tobias, Jesus the Son of Sirach,\nThe Book of Judith, Baruch the Prophet,\nThe Song of the Three Children, The Prayer of Manasses,\nThe Story of Susanna, The First Book of Maccabees,\nOf Bel and the Dragon, The Second Book of Maccabees.\n\nAll the Books of the New Testament, as they are commonly received, \nwe do receive, and account them Canonical.",
    'VII': "OF THE OLD TESTAMENT.\nThe Old Testament is not contrary to the New: for both in the Old and New Testament everlasting life is offered to Mankind by Christ, who is the only Mediator between God and Man, being both God and Man. Wherefore they are not to be heard, which feign that the old Fathers did look only for transitory promises. Although the Law given from God by Moses, as touching Ceremonies and Rites, do not bind Christian men, nor the Civil precepts thereof ought of necessity to be received in any commonwealth; yet notwithstanding, no Christian man whatsoever is free from the obedience of the Commandments which are called Moral.",
    'VIII': "OF THE CREEDS.\nThe Nicene Creed, and that which is commonly called the Apostles' Creed, ought thoroughly to be received and believed: for they may be proved by most certain warrants of Holy Scripture.",
    'IX': "OF ORIGINAL OR BIRTH-SIN.\nOriginal sin standeth not in the following of Adam, (as the Pelagians do vainly talk;) but it is the fault and corruption of the Nature of every man, that naturally is engendered of the offspring of Adam; whereby man is very far gone from original righteousness, and is of his own nature inclined to evil, so that the flesh lusteth always contrary to the Spirit; and therefore in every person born into this world, it deserveth God's wrath and damnation. And this infection of nature doth remain, yea in them that are regenerated; whereby the lust of the flesh, called in Greek, φρονημα σαρκος, (which some do expound the wisdom, some sensuality, some the affection, some the desire, of the flesh), is not subject to the Law of God. And although there is no condemnation for them that believe and are baptized; yet the Apostle doth confess, that concupiscence and lust hath of itself the nature of sin.",
    'X': "OF FREE-WILL.\nThe condition of Man after the fall of Adam is such, that he cannot turn and prepare himself, by his own natural strength and good works, to faith; and calling upon God. Wherefore we have no power to do good works pleasant and acceptable to God, without the grace of God by Christ preventing us, that we may have a good will, and working with us, when we have that good will.",
    'XI': "OF THE JUSTIFICATION OF MAN.\nWe are accounted righteous before God, only for the merit of our Lord and Saviour Jesus Christ by Faith, and not for our own works or deservings. Wherefore, that we are justified by Faith only, is a most wholesome Doctrine, and very full of comfort, as more largely is expressed in the Homily of Justification.",
    'XII': "OF GOOD WORKS.\nAlbeit that Good Works, which are the fruits of Faith, and follow after Justification, cannot put away our sins, and endure the severity of God's judgment; yet are they pleasing and acceptable to God in Christ, and do spring out necessarily of a true and lively Faith insomuch that by them a lively Faith may be as evidently known as a tree discerned by the fruit.",
    'XIII': "OF WORKS BEFORE JUSTIFICATION.\nWorks done before the grace of Christ, and the Inspiration of his Spirit, are not pleasant to God, forasmuch as they spring not of faith in Jesus Christ; neither do they make men meet to receive grace, or (as the School-authors say) deserve grace of congruity: yea rather, for that they are not done as God hath willed and commanded them to be done, we doubt not but they have the nature of sin.",
    'XIV': "OF WORKS OF SUPEREROGATION.\nVoluntary Works besides, over and above, God's Commandments, which they call Works of Supererogation, cannot be taught without arrogancy and impiety: for by them men do declare, that they do not only render unto God as much as they are bound to do, but that they do more for his sake, than of bounden duty is required: whereas Christ saith plainly When ye have done all that are commanded to you, say, We are unprofitable servants.",
    'XV': "OF CHRIST ALONE WITHOUT SIN.\nChrist in the truth of our nature was made like unto us in all things, sin only except, from which he was clearly void, both in his flesh, and in his spirit. He came to be the Lamb without spot, who, by sacrifice of himself once made, should take away the sins of the world; and sin (as Saint John saith) was not in him. But all we the rest, although baptized and born again in Christ, yet offend in many things; and if we say we have no sin, we deceive ourselves, and the truth is not in us.",
    'XVI': "OF SIN AFTER BAPTISM.\nNot every deadly sin willingly committed after Baptism is sin against the Holy Ghost, and unpardonable. Wherefore the grant of repentance is not to be denied to such as fall into sin after Baptism. After we have received the Holy Ghost, we may depart from grace given, and fall into sin, and by the grace of God we may arise again, and amend our lives. And therefore they are to be condemned, which say, they can no more sin as long as they live here, or deny the place of forgiveness to such as truly repent.",
    'XVII': "OF PREDESTINATION AND ELECTION.\nPredestination to Life is the everlasting purpose of God, whereby (before the foundations of the world were laid) he hath constantly decreed by his counsel secret to us, to deliver from curse and damnation those whom he hath chosen in Christ out of mankind, and to bring them by Christ to everlasting salvation, as vessels made to honour. Wherefore, they which be endued with so excellent a benefit of God, be called according to God's purpose by his Spirit working in due season: they through Grace obey the calling: they be justified freely: they be made sons of God by adoption: they be made like the image of his only-begotten Son Jesus Christ: they walk religiously in good works, and at length, by God's mercy, they attain to everlasting felicity.\n\nAs the godly consideration of Predestination, and our Election in Christ, is full of sweet, pleasant, and unspeakable comfort to godly persons, and such as feel in themselves the working of the Spirit of Christ, mortifying the works of the flesh, and their earthly members, and drawing up their mind to high and heavenly things, as well because it doth greatly establish and confirm their faith of eternal Salvation to be enjoyed through Christ as because it doth fervently kindle their love towards God: So, for curious and carnal persons, lacking the Spirit of Christ, to have continually before their eyes the sentence of God's Predestination, is a most dangerous downfall, whereby the Devil doth thrust them either into desperation, or into wretchlessness of most unclean living, no less perilous than desperation.\n\nFurthermore, we must receive God's promises in such wise, as they be generally set forth to us in Holy Scripture: and, in our doings, that Will of God is to be followed, which we have expressly declared unto us in the Word of God.",
    'XVIII': "OF OBTAINING ETERNAL SALVATION ONLY BY THE NAME OF CHRIST.\nThey also are to be had accursed that presume to say, That every man shall be saved by the Law or Sect which he professeth, so that he be diligent to frame his life according to that Law, and the light of Nature. For Holy Scripture doth set out unto us only the Name of Jesus Christ, whereby men must be saved.",
    'XIX': "OF THE CHURCH.\nThe visible Church of Christ is a congregation of faithful men, in which the pure Word of God is preached, and the Sacraments be duly ministered according to Christ's ordinance, in all those things that of necessity are requisite to the same.\n\nAs the Church of Jerusalem, Alexandria, and Antioch, have erred, so also the Church of Rome hath erred, not only in their living and manner of Ceremonies, but also in matters of Faith.",
    'XX': "OF THE AUTHORITY OF THE CHURCH.\nThe Church hath power to decree Rites or Ceremonies, and authority in Controversies of Faith: and yet it is not lawful for the Church to ordain any thing that is contrary to God's Word written, neither may it so expound one place of Scripture, that it be repugnant to another. Wherefore, although the Church be a witness and a keeper of Holy Writ, yet, as it ought not to decree any thing against the same, so besides the same ought it not to enforce any thing to be believed for necessity of Salvation.",
    'XXI': "OF THE AUTHORITY OF GENERAL COUNCILS.\n[The Twenty-first of the former Articles is omitted; because it is partly of a local and civil nature, and is provided for, as to the remaining parts of it, in other Articles.]\n\nThe original 1571, 1662 text of this Article, omitted in the version of 1801, reads as follows: \"General Councils may not be gathered together without the commandment and will of Princes. And when they be gathered together, (forasmuch as they be an assembly of men, whereof all be not governed with the Spirit and Word of God,) they may err, and sometimes have erred, even in things pertaining unto God. Wherefore things ordained by them as necessary to salvation have neither strength nor authority, unless it may be declared that they be taken out of holy Scripture.\"",
    'XXII': "OF PURGATORY.\nThe Romish Doctrine concerning Purgatory, Pardons, Worshipping and Adoration, as well of Images as of Relics, and also Invocation of Saints, is a fond thing, vainly invented, and grounded upon no warranty of Scripture, but rather repugnant to the Word of God.",
    'XXIII': "OF MINISTERING IN THE CONGREGATION.\nIt is not lawful for any man to take upon him the office of public preaching, or ministering the Sacraments in the Congregation, before he be lawfully called, and sent to execute the same. And those we ought to judge lawfully called and sent, which be chosen and called to this work by men who have public authority given unto them in the Congregation, to call and send Ministers into the Lord's vineyard.",
    'XXIV': "OF SPEAKING IN THE CONGREGATION IN SUCH A TONGUE AS THE PEOPLE UNDERSTANDETH.\nIt is a thing plainly repugnant to the Word of God, and the custom of the Primitive Church to have public Prayer in the Church, or to minister the Sacraments, in a tongue not understanded of the people.",
    'XXV': "OF THE SACRAMENTS.\nSacraments ordained of Christ be not only badges or tokens of Christian men's profession, but rather they be certain sure witnesses, and effectual signs of grace, and God's good will towards us, by the which he doth work invisibly in us, and doth not only quicken, but also strengthen and confirm our Faith in him.\n\nThere are two Sacraments ordained of Christ our Lord in the Gospel, that is to say, Baptism, and the Supper of the Lord.\n\nThose five commonly called Sacraments, that is to say, Confirmation, Penance, Orders, Matrimony, and Extreme Unction, are not to be counted for Sacraments of the Gospel, being such as have grown partly of the corrupt following of the Apostles, partly are states of life allowed in the Scriptures, but yet have not like nature of Sacraments with Baptism, and the Lord's Supper, for that they have not any visible sign or ceremony ordained of God.\n\nThe Sacraments were not ordained of Christ to be gazed upon, or to be carried about, but that we should duly use them. And in such only as worthily receive the same, they have a wholesome effect or operation: but they that receive them unworthily, purchase to themselves damnation, as Saint Paul saith.",
    'XXVI': "OF THE UNWORTHINESS OF THE MINISTERS, WHICH HINDERS NOT THE EFFECT OF THE SACRAMENTS.\nAlthough in the visible Church the evil be ever mingled with the good, and sometimes the evil have chief authority in the Ministration of the Word and Sacraments, yet forasmuch as they do not the same in their own name, but in Christ's, and do minister by his commission and authority, we may use their Ministry, both in hearing the Word of God, and in receiving the Sacraments. Neither is the effect of Christ's ordinance taken away by their wickedness, nor the grace of God's gifts diminished from such as by faith, and rightly, do receive the Sacraments ministered unto them; which be effectual, because of Christ's institution and promise, although they be ministered by evil men.\n\nNevertheless, it appertaineth to the discipline of the Church, that inquiry be made of evil Ministers, and that they be accused by those that have knowledge of their offences; and finally, being found guilty, by just judgment be deposed.",
    'XXVII': "OF BAPTISM.\nBaptism is not only a sign of profession, and mark of difference, whereby Christian men are discerned from others that be not christened, but it is also a sign of Regeneration or New-Birth, whereby, as by an instrument, they that receive Baptism rightly are grafted into the Church; the promises of the forgiveness of sin, and of our adoption to be the sons of God by the Holy Ghost, are visibly signed and sealed, Faith is confirmed, and Grace increased by virtue of prayer unto God.\n\nThe Baptism of young Children is in any wise to be retained in the Church, as most agreeable with the institution of Christ.",
    'XXVIII': "OF THE LORD'S SUPPER.\nThe Supper of the Lord is not only a sign of the love that Christians ought to have among themselves one to another, but rather it is a Sacrament of our Redemption by Christ's death: insomuch that to such as rightly, worthily, and with faith, receive the same, the Bread which we break is a partaking of the Body of Christ; and likewise the Cup of Blessing is a partaking of the Blood of Christ.\n\nTransubstantiation (or the change of the substance of Bread and Wine) in the Supper of the Lord, cannot be proved by Holy Writ; but is repugnant to the plain words of Scripture, overthroweth the nature of a Sacrament, and hath given occasion to many superstitions.\n\nThe Body of Christ is given, taken, and eaten, in the Supper, only after an heavenly and spiritual manner. And the mean whereby the Body of Christ is received and eaten in the Supper, is Faith.\n\nThe Sacrament of the Lord's Supper was not by Christ's ordinance reserved, carried about, lifted up, or worshipped.",
    'XXIX': "OF THE WICKED, WHICH EAT NOT THE BODY OF CHRIST IN THE USE OF THE LORD'S SUPPER.\nThe Wicked, and such as be void of a lively faith, although they do carnally and visibly press with their teeth (as Saint Augustine saith) the Sacrament of the Body and Blood of Christ; yet in no wise are they partakers of Christ: but rather, to their condemnation, do eat and drink the sign or Sacrament of so great a thing.",
    'XXX': "OF BOTH KINDS.\nThe Cup of the Lord is not to be denied to the Lay-people: for both the parts of the Lord's Sacrament, by Christ's ordinance and commandment, ought to be ministered to all Christian men alike.",
    'XXXI': "OF THE ONE OBLATION OF CHRIST FINISHED UPON THE CROSS.\nThe Offering of Christ once made is that perfect redemption, propitiation, and satisfaction, for all the sins of the whole world, both original and actual; and there is none other satisfaction for sin, but that alone. Wherefore the sacrifices of Masses, in the which it was commonly said, that the Priest did offer Christ for the quick and the dead, to have remission of pain or guilt, were blasphemous fables, and dangerous deceits.",
    'XXXII': "OF THE MARRIAGE OF PRIESTS.\nBishops, Priests, and Deacons, are not commanded by God's Law, either to vow the estate of single life, or to abstain from marriage: therefore it is lawful for them, as for all other Christian men, to marry at their own discretion, as they shall judge the same to serve better to godliness.",
    'XXXIII': "OF EXCOMMUNICATE PERSONS, HOW THEY ARE TO BE AVOIDED.\nThat person which by open denunciation of the Church is rightly cut off from the unity of the Church, and excommunicated, ought to be taken of the whole multitude of the faithful, as an Heathen and Publican, until he be openly reconciled by penance, and received into the Church by a Judge that hath authority thereunto.",
    'XXXIV': "OF THE TRADITIONS OF THE CHURCH.\nIt is not necessary that Traditions and Ceremonies be in all places one, or utterly like; for at all times they have been divers, and may be changed according to the diversity of countries, times, and men's manners, so that nothing be ordained against God's Word. Whosoever, through his private judgment, willingly and purposely, doth openly break the Traditions and Ceremonies of the Church, which be not repugnant to the Word of God, and be ordained and approved by common authority, ought to be rebuked openly, (that others may fear to do the like,) as he that offendeth against the common order of the Church, and hurteth the authority of the Magistrate, and woundeth the consciences of the weak brethren.\n\nEvery particular or national Church hath authority to ordain, change, and abolish, Ceremonies or Rites of the Church ordained only by man's authority, so that all things be done to edifying.",
    'XXXV': "OF THE HOMILIES.\nThe Second Book of Homilies, the several titles whereof we have joined under this Article, doth contain a godly and wholesome Doctrine, and necessary for these times, as doth the former Book of Homilies, which were set forth in the time of Edward the Sixth; and therefore we judge them to be read in Churches by the Ministers, diligently and distinctly, that they may he understanded of the people.\n\nOf the Names of the Homilies.\n\n1 Of the right Use of the Church.\n2 Against Peril of Idolatry.\n3 Of repairing and keeping clean of Churches.\n4 Of good Works: first of Fasting.\n5 Against Gluttony and Drunkenness.\n6 Against Excess of Apparel.\n7 Of Prayer.\n8 Of the Place and Time of Prayer.\n9 That Common Prayers and Sacraments ought to be ministered in a known tongue.\n10 Of the reverend Estimation of God's Word.\n11 Of Alms-doing.\n12 Of the Nativity of Christ.\n13 Of the Passion of Christ.\n14 Of the Resurrection of Christ.\n15 Of the worthy receiving of the Sacrament of the Body and Blood of Christ.\n16 Of the Gifts of the Holy Ghost.\n17 For the Rogation-days.\n18 Of the State of Matrimony.\n19 Of Repentance.\n20 Against Idleness.\n21 Against Rebellion.\n\n[This Article is received in this Church, so far as it declares the Books of Homilies to be an explication of Christian doctrine, and instructive in piety and morals. But all references to the constitution and laws of England are considered as inapplicable to the circumstances of this Church; which also suspends the order for the reading of said Homilies in churches, until a revision of them may be conveniently made, for the clearing of them, as well from obsolete words and phrases, as from the local references.]",
    'XXXVI': "OF CONSECRATION OF BISHOPS AND MINISTERS.\nThe Book of Consecration of Bishops, and Ordering of Priests and Deacons, as set forth by the General Convention of this Church in 1792, doth contain all things necessary to such Consecration and Ordering; neither hath it any thing that, of itself, is superstitious and ungodly. And, therefore, whosoever are consecrated or ordered according to said Form, we decree all such to be rightly, orderly, and lawfully consecrated and ordered.",
    'XXXVII': "OF THE POWER OF THE CIVIL MAGISTRATES.\nThe Power of the Civil Magistrate extendeth to all men, as well Clergy as Laity, in all things temporal; but hath no authority in things purely spiritual. And we hold it to be the duty of all men who are professors of the Gospel, to pay respectful obedience to the Civil Authority, regularly and legitimately constituted.",
    'XXXVIII': "OF CHRISTIAN MEN'S GOODS, WHICH ARE NOT COMMON.\nThe Riches and Goods of Christians are not common, as touching the right, title, and possession of the same; as certain Anabaptists do falsely boast. Notwithstanding, every man ought, of such things as he possesseth, liberally to give alms to the poor, according to his ability.",
    'XXXIX': "OF A CHRISTIAN MAN'S OATH.\nAs we confess that vain and rash Swearing is forbidden Christian men by our Lord Jesus Christ, and James his Apostle, so we judge, that Christian Religion doth not prohibit, but that a man may swear when the Magistrate requireth, in a cause of faith and charity, so it be done according to the Prophet's teaching in justice, judgment, and truth.",
};

// Cool, turns a num into a Roman numeral
function numberToRoman(num) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman_num = "",
        i = 3;
    while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    return Array(+digits.join("") + 1).join("M") + roman_num;
}

// Help
function printUsage() {
    console.log(styleText('yellowBright', '\nCranmer: The 39 Articles of Religion'));
    console.log(styleText('dim',          '  ✝️  Book of Common Prayer — Anglican formulary of 1571\n'));
    console.log(styleText('white', 'Usage:'));
    console.log(`  cranmer.js ${styleText('cyan', '<article>')}`);
    console.log(`  cranmer.js ${styleText('cyan', '--list')}\n`);
    console.log(styleText('white', 'Options:'));
    console.log(`  ${styleText('cyan', '<article>')}   Article number (1–39) or Roman numeral (I–XXXIX)`);
    console.log(`  ${styleText('cyan', '--list')}      List all 39 Articles\n`);
    console.log(styleText('white', 'Examples:'));
    console.log(`  cranmer.js ${styleText('green', '28')}`);
    console.log(`  cranmer.js ${styleText('green', 'XXVIII')}\n`);
}

// List all the articles
function printList() {
    console.log(styleText('yellowBright', '\nThe Thirty-Nine Articles of Religion\n'));
    for (const [roman, text] of Object.entries(articles)) {
        const title = text.split('\n')[0];
        console.log(`  ${styleText('cyan', ('Article ' + roman).padEnd(16))} ${styleText('dim', title)}`);
    }
    console.log();
}

// Arguments
const arg = process.argv[2];

// Handle other modes
if (arg === '--help' || arg === '-h') {
    printUsage();
    process.exit(arg ? 0 : 1);
}
if (arg === '--list' || arg === '-l') {
    printList();
    process.exit(0);
}

// Our actual variable we'll be messing with, by Jove
var roman = "";

// Where the everything happens
function getArticle(input) {
    let roman = input.toUpperCase();
    if (!isNaN(input)) {
        const n = parseInt(input, 10);
        if (n < 1 || n > 39) {
            console.error(styleText('red', `Error: Article number must be between 1 and 39.`));
            process.exit(1);
        }
        roman = numberToRoman(n);
    }
    const content = articles[roman];
    if (!content) {
        console.error(styleText('red', `Error: "${input}" isn't valid. (Num or Roman numeral 1-39)`));
        process.exit(1);
    }
    const [title, ...body] = content.split('\n');
    console.log();
    console.log(styleText('yellowBright', `Article ${roman}`));
    console.log(styleText('cyan', '-'.repeat(60)));
    console.log(styleText(['white', 'bold'], title));
    console.log(styleText('cyan', '-'.repeat(60)));
    console.log(styleText('dim', wordWrap(body.join('\n'))));
    console.log();
}

// Go to interactive mode if no argument
if (!arg) {
    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(styleText('cyan', 'Enter the number or Roman numeral of an Article: '), input => {
        getArticle(input.trim());
        rl.close();
    });
} else if (arg === '--help' || arg === '-h') {
    printUsage();
} else if (arg === '--list' || arg === '-l') {
    printList();
} else {
    getArticle(arg);
}
