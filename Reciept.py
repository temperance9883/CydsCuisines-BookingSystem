# imports module 
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, TableStyle  # type: ignore
from reportlab.lib import colors  # type: ignore
from reportlab.lib.pagesizes import A4  # type: ignore
from reportlab.lib.styles import getSampleStyleSheet  # type: ignore


# data which we are going to display as tables 
DATA = [ 
    [ "Date" , "Name", "Preprations", "Price" ], 
    [ 
        "01/11/2025", 
        "Baby Shower", 
        "3 Weeks", 
        "$450", 
    ], 
    [ "08/15/2025", "Wedding", "2 Weeks", "$700"], 
    [ "Sub Total", "", "", "$1150"], 
    [ "Discount", "", "", "-$100"], 
    [ "Total", "", "", "$1050"], 
] 
  
# creating a Base Document Template of page size A4 
pdf = SimpleDocTemplate( "receipt.pdf" , pagesize = A4 ) 

# standard stylesheet defined within reportlab 
styles = getSampleStyleSheet() 
  
#Top level heading (Heading1) 
title_style = styles[ "Heading1" ] 
  
# 0: left, 1: center, 2: right 
title_style.alignment = 1
  
# creating the paragraph with  
# the heading text and passing the styles of it 
title = Paragraph( "Cyd's Cuisines" , title_style) 
  
# creates a Table Style object and in it,

style = TableStyle( 
    [ 
        ( "BOX" , ( 0, 0 ), ( -1, -1 ), 1 , colors.black ), 
        ( "GRID" , ( 0, 0 ), ( 4 , 4 ), 1 , colors.black ), 
        ( "BACKGROUND" , ( 0, 0 ), ( 3, 0 ), colors.lightseagreen), 
        ( "TEXTCOLOR" , ( 0, 0 ), ( -1, 0 ), colors.white), 
        ( "ALIGN" , ( 0, 0 ), ( -1, -1 ), "CENTER" ), 
        ( "BACKGROUND" , ( 0 , 1 ) , ( -1 , -1 ), colors.lightseagreen), 
    ] 
) 
  
# creates a table object and passes the style to it 
table = Table( DATA , style = style ) 
  
# final step which builds the 
# actual pdf putting together all the elements 
pdf.build([ title , table ]) 